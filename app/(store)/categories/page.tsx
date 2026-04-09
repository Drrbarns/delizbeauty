import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';

export const revalidate = 0; // Ensure fresh data on every visit

export default async function CategoriesPage() {
  const { data: categoriesData } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      description,
      image_url,
      position
    `)
    .eq('status', 'active')
    .order('position', { ascending: true });

  // Palette to cycle through for visual variety since DB doesn't have colors
  const palette = [
    { color: 'from-gray-700 to-gray-900', icon: 'ri-store-2-line' },
    { color: 'from-blue-500 to-blue-700', icon: 'ri-shopping-bag-3-line' },
    { color: 'from-purple-500 to-purple-700', icon: 'ri-t-shirt-line' },
    { color: 'from-amber-500 to-amber-700', icon: 'ri-home-smile-line' },
    { color: 'from-rose-500 to-rose-700', icon: 'ri-heart-line' },
    { color: 'from-indigo-500 to-indigo-700', icon: 'ri-star-smile-line' },
  ];

  const categories = categoriesData?.map((c, i) => {
    const style = palette[i % palette.length];
    return {
      ...c,
      image: c.image_url || 'https://via.placeholder.com/600x400?text=Category',
      color: style.color,
      icon: style.icon,
      // Optional: Fetch product count if needed, currently skipping for performance/simplicity
      productCount: 'Browse',
    };
  }) || [];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Shop by Category"
        subtitle="Explore our curated collections and find exactly what you're looking for"
        image="/categories.jpeg"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={{ pathname: '/shop', query: { category: category.slug } }}
                className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden cursor-pointer border border-black/[0.03] shadow-[0_8px_30px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              >
                <div className="relative h-64">
                  <div className="absolute inset-0 overflow-hidden rounded-t-[2rem]">
                    <div className="absolute inset-0 bg-black/5 z-10 transition-opacity duration-500 group-hover:opacity-0" />
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} mix-blend-multiply opacity-0 group-hover:opacity-30 transition-opacity duration-700 z-10`} />
                  </div>

                  <div className="absolute -bottom-6 left-6 z-20">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} blur-md opacity-40 rounded-2xl group-hover:opacity-60 transition-opacity duration-500`} />
                      <div className={`relative w-14 h-14 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center border-[3px] border-white shadow-sm transform group-hover:-translate-y-1 transition-transform duration-500`}>
                        <i className={`${category.icon} text-[22px] text-white`}></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pt-10 pb-6 flex flex-col flex-1 relative z-10 bg-white">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1.5 block">Collection</span>
                    <h3 className="font-serif text-2xl font-bold text-gray-900 group-hover:text-black transition-colors">{category.name}</h3>
                  </div>

                  <p className="text-gray-500 leading-relaxed text-[14px] font-medium mb-8 line-clamp-2 mt-3">
                    {category.description || 'Explore our exclusive collection in this category.'}
                  </p>

                  <div className="mt-auto">
                    <div className="h-[1px] w-full bg-gray-100 mb-5 group-hover:bg-gray-200 transition-colors duration-500" />
                    <div className="flex items-center justify-between group/btn">
                      <span className="text-[13px] font-bold uppercase tracking-wide text-gray-900">Browse</span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover/btn:bg-gray-900 transition-all duration-300">
                        <i className="ri-arrow-right-line text-sm text-gray-600 group-hover/btn:text-white transform group-hover/btn:translate-x-0.5 transition-all"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <i className="ri-inbox-line text-5xl text-gray-300 mb-4"></i>
            <p className="text-xl text-gray-500">No categories found.</p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Try our advanced search or contact our team for personalised product recommendations
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              <i className="ri-search-line"></i>
              Search All Products
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              <i className="ri-customer-service-line"></i>
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
