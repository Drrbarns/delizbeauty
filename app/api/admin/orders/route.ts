import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

async function requireAdmin(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: profile } = await supabaseAdmin
    .from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'staff'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return null;
}

export async function GET(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period'); // for stats endpoint

    // Sales stats mode
    if (period !== null) {
      let startDate: string | null = null;
      const now = new Date();
      if (period === '24h') { const d = new Date(now); d.setHours(d.getHours() - 24); startDate = d.toISOString(); }
      else if (period === '7d') { const d = new Date(now); d.setDate(d.getDate() - 7); startDate = d.toISOString(); }
      else if (period === '30d') { const d = new Date(now); d.setDate(d.getDate() - 30); startDate = d.toISOString(); }

      let query = supabaseAdmin
        .from('order_items')
        .select(`quantity, product_name, product_id, variant_name, total_price, orders!inner(id, created_at, status, payment_status)`)
        .eq('orders.payment_status', 'paid')
        .neq('orders.status', 'cancelled');

      if (startDate) query = query.gte('orders.created_at', startDate);

      const { data, error } = await query;
      if (error) throw error;
      return NextResponse.json({ items: data || [] });
    }

    // Full orders list
    const { data: ordersData, error } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        order_number,
        email,
        total,
        status,
        payment_status,
        payment_method,
        shipping_method,
        created_at,
        phone,
        shipping_address,
        metadata,
        order_items (
          quantity,
          product_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ orders: ordersData || [] });
  } catch (e: any) {
    console.error('Admin orders API error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
