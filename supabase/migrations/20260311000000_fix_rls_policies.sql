-- Comprehensive RLS policy fix.
-- Only 3 tables had policies (categories, products, product_images).
-- Every other RLS-enabled table was completely blocked for all users.

-- ─────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────
CREATE POLICY "Admin manage orders"
  ON public.orders FOR ALL
  USING (is_admin_or_staff());

-- Logged-in users see their own orders; guests see orders with no user_id via order_number (handled server-side)
CREATE POLICY "Users view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- ORDER ITEMS
-- ─────────────────────────────────────────
CREATE POLICY "Admin manage order_items"
  ON public.order_items FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Users view own order_items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- CUSTOMERS
-- ─────────────────────────────────────────
CREATE POLICY "Admin manage customers"
  ON public.customers FOR ALL
  USING (is_admin_or_staff());

-- ─────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────
CREATE POLICY "Users manage own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "Admin read all profiles"
  ON public.profiles FOR SELECT
  USING (is_admin_or_staff());

-- ─────────────────────────────────────────
-- STORE MODULES (public read so storefront sidebar works)
-- ─────────────────────────────────────────
CREATE POLICY "Public read store_modules"
  ON public.store_modules FOR SELECT
  USING (true);

CREATE POLICY "Admin manage store_modules"
  ON public.store_modules FOR ALL
  USING (is_admin_or_staff());

-- ─────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────
CREATE POLICY "Public read approved reviews"
  ON public.reviews FOR SELECT
  USING (status = 'approved' OR is_admin_or_staff());

CREATE POLICY "Authenticated users submit reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin manage reviews"
  ON public.reviews FOR ALL
  USING (is_admin_or_staff());

-- ─────────────────────────────────────────
-- PRODUCT VARIANTS (storefront product pages need to read these)
-- ─────────────────────────────────────────
CREATE POLICY "Public read product_variants"
  ON public.product_variants FOR SELECT
  USING (true);

CREATE POLICY "Admin manage product_variants"
  ON public.product_variants FOR ALL
  USING (is_admin_or_staff());

-- ─────────────────────────────────────────
-- COUPONS
-- ─────────────────────────────────────────
CREATE POLICY "Admin manage coupons"
  ON public.coupons FOR ALL
  USING (is_admin_or_staff());

-- ─────────────────────────────────────────
-- CHAT CONVERSATIONS (support)
-- ─────────────────────────────────────────
CREATE POLICY "Admin manage chat_conversations"
  ON public.chat_conversations FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Public insert chat_conversations"
  ON public.chat_conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Session owner read chat_conversations"
  ON public.chat_conversations FOR SELECT
  USING (true);

-- ─────────────────────────────────────────
-- SUPPORT TICKETS
-- ─────────────────────────────────────────
CREATE POLICY "Admin manage support_tickets"
  ON public.support_tickets FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Users create support_tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users read own support_tickets"
  ON public.support_tickets FOR SELECT
  USING (true);

-- ─────────────────────────────────────────
-- SUPPORT TICKET MESSAGES
-- ─────────────────────────────────────────
CREATE POLICY "Admin manage support_ticket_messages"
  ON public.support_ticket_messages FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Public insert support_ticket_messages"
  ON public.support_ticket_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public read support_ticket_messages"
  ON public.support_ticket_messages FOR SELECT
  USING (true);

-- ─────────────────────────────────────────
-- AI MEMORY
-- ─────────────────────────────────────────
CREATE POLICY "Admin manage ai_memory"
  ON public.ai_memory FOR ALL
  USING (is_admin_or_staff());

-- ─────────────────────────────────────────
-- BANNERS / CMS / PAGES / NAVIGATION (public read)
-- ─────────────────────────────────────────
CREATE POLICY "Public read banners"
  ON public.banners FOR SELECT
  USING (true);

CREATE POLICY "Admin manage banners"
  ON public.banners FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Public read cms_content"
  ON public.cms_content FOR SELECT
  USING (true);

CREATE POLICY "Admin manage cms_content"
  ON public.cms_content FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Public read pages"
  ON public.pages FOR SELECT
  USING (true);

CREATE POLICY "Admin manage pages"
  ON public.pages FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Public read navigation_menus"
  ON public.navigation_menus FOR SELECT
  USING (true);

CREATE POLICY "Admin manage navigation_menus"
  ON public.navigation_menus FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Public read navigation_items"
  ON public.navigation_items FOR SELECT
  USING (true);

CREATE POLICY "Admin manage navigation_items"
  ON public.navigation_items FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Public read site_settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admin manage site_settings"
  ON public.site_settings FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Public read store_settings"
  ON public.store_settings FOR SELECT
  USING (true);

CREATE POLICY "Admin manage store_settings"
  ON public.store_settings FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Public read blog_posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published' OR is_admin_or_staff());

CREATE POLICY "Admin manage blog_posts"
  ON public.blog_posts FOR ALL
  USING (is_admin_or_staff());

-- ─────────────────────────────────────────
-- WISHLIST ITEMS
-- ─────────────────────────────────────────
CREATE POLICY "Users manage own wishlist"
  ON public.wishlist_items FOR ALL
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- CART ITEMS
-- ─────────────────────────────────────────
CREATE POLICY "Users manage own cart"
  ON public.cart_items FOR ALL
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- ADDRESSES
-- ─────────────────────────────────────────
CREATE POLICY "Users manage own addresses"
  ON public.addresses FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admin read all addresses"
  ON public.addresses FOR SELECT
  USING (is_admin_or_staff());

-- ─────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────
CREATE POLICY "Users read own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id OR is_admin_or_staff());

CREATE POLICY "Admin manage notifications"
  ON public.notifications FOR ALL
  USING (is_admin_or_staff());

-- ─────────────────────────────────────────
-- AUDIT LOGS
-- ─────────────────────────────────────────
CREATE POLICY "Admin read audit_logs"
  ON public.audit_logs FOR SELECT
  USING (is_admin_or_staff());

-- ─────────────────────────────────────────
-- REVIEW IMAGES
-- ─────────────────────────────────────────
CREATE POLICY "Public read review_images"
  ON public.review_images FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users add review_images"
  ON public.review_images FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin manage review_images"
  ON public.review_images FOR ALL
  USING (is_admin_or_staff());

-- ─────────────────────────────────────────
-- SUPPORT KNOWLEDGE BASE / CANNED RESPONSES
-- ─────────────────────────────────────────
CREATE POLICY "Admin manage support_knowledge_base"
  ON public.support_knowledge_base FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Admin manage support_canned_responses"
  ON public.support_canned_responses FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Admin manage support_escalation_rules"
  ON public.support_escalation_rules FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Admin manage support_feedback"
  ON public.support_feedback FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Admin manage support_analytics_daily"
  ON public.support_analytics_daily FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Admin manage customer_insights"
  ON public.customer_insights FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Admin manage return_requests"
  ON public.return_requests FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Admin manage return_items"
  ON public.return_items FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Admin manage riders"
  ON public.riders FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Admin manage delivery_assignments"
  ON public.delivery_assignments FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Admin manage delivery_status_history"
  ON public.delivery_status_history FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Admin manage delivery_zones"
  ON public.delivery_zones FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Admin manage order_status_history"
  ON public.order_status_history FOR ALL
  USING (is_admin_or_staff());

CREATE POLICY "Admin manage roles"
  ON public.roles FOR ALL
  USING (is_admin_or_staff());
