-- إضافة الأقسام
INSERT INTO categories (id, name_en, name_ar, icon, color, display_order, is_active)
VALUES 
('snacks', 'Snacks', 'وجبات خفيفة', '🥜', 'bg-fruit-accent', 1, true),
('fresh_vegetables', 'Fresh Vegetables', 'خضروات طازجة', '🥬', 'bg-green-500', 2, true),
('imported_fruits', 'Imported Fruits', 'فواكه مستوردة', '🍇', 'bg-fruit-primary', 3, true),
('special_offers', 'Special Offers', 'العروض الخاصة', '🔥', 'bg-red-500', 4, true),
('savings_boxes', 'Savings Boxes', 'صناديق التوفير', '📦', 'bg-purple-500', 5, true),
('organic', 'Organic', 'عضوي', '🌿', 'bg-emerald-500', 6, true),
('local_products', 'Local Products', 'منتجات محلية', '🌽', 'bg-yellow-500', 7, true),
('just_arrived', 'Just Arrived', 'وصل حديثاً', '🆕', 'bg-blue-500', 8, true),
('app_exclusive', 'App Exclusive', 'حصري التطبيق', '📱', 'bg-pink-500', 9, true),
('ai_recommendations', 'AI Recommendations', 'اختيارات الذكاء', '🤖', 'bg-indigo-500', 10, true)
ON CONFLICT (id) DO UPDATE SET 
name_en = EXCLUDED.name_en, 
name_ar = EXCLUDED.name_ar, 
icon = EXCLUDED.icon;

-- إضافة عينة من المنتجات
INSERT INTO products (id, category_id, name_en, name_ar, price, old_price, discount_percent, weight, unit, is_in_stock, is_featured)
VALUES 
('local-010', 'local_products', 'Homemade Pickles', 'مخللات منزلية', 15, 20, 25, '500gm', 'gm', true, false),
('local-012', 'local_products', 'Egyptian Lemons', 'ليمون مصري', 20, 25, 20, '1kg', 'kg', true, false),
('special-001', 'special_offers', 'Premium Dates', 'تمور فاخرة', 45, 60, 25, '1kg', 'kg', true, true)
ON CONFLICT (id) DO UPDATE SET 
price = EXCLUDED.price, 
is_in_stock = EXCLUDED.is_in_stock;