-- ==========================================
-- POPULATE PRODUCTS SCRIPT
-- ==========================================

-- We will use a temporary function to easily look up category IDs by name
-- This avoids hardcoding UUIDs which might change if the DB is reset
CREATE OR REPLACE FUNCTION get_cat_id(cat_name text) RETURNS uuid AS $$
  SELECT id FROM categories WHERE name_en = cat_name OR name_ar = cat_name LIMIT 1;
$$ LANGUAGE SQL;

INSERT INTO public.products (category_id, name_ar, name_en, description_ar, price, unit, stock_quantity, image_url, is_featured, is_organic, is_local) VALUES

-- 1. Recently Arrived (Using generic fresh items)
((SELECT get_cat_id('Recently Arrived')), 'مانجو عويس', 'Owais Mango', 'مانجو عويس فاخرة طازجة', 60.00, 'kg', 50, 'https://images.unsplash.com/photo-1553279768-865429fa0078', true, false, true),
((SELECT get_cat_id('Recently Arrived')), 'تين شوكي', 'Prickly Pear', 'تين شوكي مقشر جاهز للأكل', 25.00, 'pack', 30, 'https://images.unsplash.com/photo-1596568600720-67c134812ae7', false, false, true),
((SELECT get_cat_id('Recently Arrived')), 'بطيخ', 'Watermelon', 'بطيخ أحمر حلو المذاق', 40.00, 'piece', 20, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38', true, false, true),
((SELECT get_cat_id('Recently Arrived')), 'شمام', 'Cantaloupe', 'شمام سكري طازج', 15.00, 'kg', 40, 'https://images.unsplash.com/photo-1596700813958-8120d04c478a', false, false, false),
((SELECT get_cat_id('Recently Arrived')), 'خوخ', 'Peach', 'خوخ بلدي طازج', 35.00, 'kg', 60, 'https://images.unsplash.com/photo-1521255551398-e7b3379aa807', false, false, true),
((SELECT get_cat_id('Recently Arrived')), 'مشمش', 'Apricot', 'مشمش فاخر', 40.00, 'kg', 50, 'https://images.unsplash.com/photo-1501746876-e49cfa35dcee', false, false, false),
((SELECT get_cat_id('Recently Arrived')), 'بامية', 'Okra', 'بامية خضراء طازجة', 30.00, 'kg', 45, 'https://images.unsplash.com/photo-1459411606709-3877d9c6e73c', false, false, true),
((SELECT get_cat_id('Recently Arrived')), 'ملوخية', 'Molokhia', 'ملوخية خضراء طازجة', 10.00, 'bundle', 100, 'https://images.unsplash.com/photo-1615485925694-a031e6639d4e', false, false, true),
((SELECT get_cat_id('Recently Arrived')), 'ليمون', 'Lemon', 'ليمون أصفر طازج', 20.00, 'kg', 80, 'https://images.unsplash.com/photo-1592595896551-12b371d546d5', false, false, false),
((SELECT get_cat_id('Recently Arrived')), 'كيوي', 'Kiwi', 'كيوي مستورد فاخر', 90.00, 'kg', 30, 'https://images.unsplash.com/photo-1585671175655-b467d355f30e', false, false, false),

-- 2. Local Products (Vegetables & Fruits)
((SELECT get_cat_id('Local Products')), 'بصل أحمر', 'Red Onion', 'بصل أحمر للطبخ', 15.00, 'kg', 200, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb', false, false, true),
((SELECT get_cat_id('Local Products')), 'بطاطس', 'Potatoes', 'بطاطس تحمير', 12.00, 'kg', 300, 'https://images.unsplash.com/photo-1518977676601-b53f82a6b69d', false, false, true),
((SELECT get_cat_id('Local Products')), 'ثوم', 'Garlic', 'ثوم بلدي', 25.00, 'kg', 100, 'https://images.unsplash.com/photo-1615477021334-92736149fd7b', false, false, true),
((SELECT get_cat_id('Local Products')), 'فلفل ألوان', 'Bell Peppers', 'فلفل ألوان (أحمر، أصفر، أخضر)', 60.00, 'kg', 50, 'https://images.unsplash.com/photo-1563565375-f3fdf5dbc240', false, false, true),
((SELECT get_cat_id('Local Products')), 'كوسة', 'Zucchini', 'كوسة خضراء طازجة', 15.00, 'kg', 70, 'https://images.unsplash.com/photo-1560787323-af6f0d944111', false, false, true),
((SELECT get_cat_id('Local Products')), 'باذنجان', 'Eggplant', 'باذنجان رومي كبير', 10.00, 'kg', 80, 'https://images.unsplash.com/photo-1528825871115-3581a5387919', false, false, true),
((SELECT get_cat_id('Local Products')), 'خس كابوتشي', 'Iceberg Lettuce', 'خس كابوتشي طازج', 10.00, 'piece', 60, 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1', false, false, true),
((SELECT get_cat_id('Local Products')), 'بقدونس', 'Parsley', 'حزمة بقدونس طازجة', 5.00, 'bundle', 150, 'https://images.unsplash.com/photo-1626245389476-cda1684c3ea0', false, false, true),
((SELECT get_cat_id('Local Products')), 'كزبرة', 'Coriander', 'حزمة كزبرة خضراء', 5.00, 'bundle', 150, 'https://images.unsplash.com/photo-1596790757989-183d2105e49f', false, false, true),
((SELECT get_cat_id('Local Products')), 'شبت', 'Dill', 'حزمة شبت طازجة', 5.00, 'bundle', 150, 'https://images.unsplash.com/photo-1605330364461-1d5423871404', false, false, true),

-- 3. Organic
((SELECT get_cat_id('Organic')), 'جزر عضوي', 'Organic Carrots', 'جزر مزروع عضوياً بدون مبيدات', 25.00, 'kg', 40, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37', false, true, true),
((SELECT get_cat_id('Organic')), 'بروكلي عضوي', 'Organic Broccoli', 'بروكلي طازج عضوي', 50.00, 'piece', 30, 'https://images.unsplash.com/photo-1459411606709-3877d9c6e73c', false, true, false),
((SELECT get_cat_id('Organic')), 'سبانخ عضوية', 'Organic Spinach', 'أوراق سبانخ طازجة عضوية', 30.00, 'pack', 25, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb', false, true, true),
((SELECT get_cat_id('Organic')), 'أفوكادو عضوي', 'Organic Avocado', 'أفوكادو هاس عضوي', 150.00, 'kg', 20, 'https://images.unsplash.com/photo-1523049673856-356964a71a5e', true, true, false),
((SELECT get_cat_id('Organic')), 'بطاطا حلوة عضوية', 'Organic Sweet Potato', 'بطاطا حلوة عضوية', 20.00, 'kg', 60, 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19', false, true, true),
((SELECT get_cat_id('Organic')), 'كرنب عضوي', 'Organic Cabbage', 'كرنب سلطة عضوي', 25.00, 'piece', 30, 'https://images.unsplash.com/photo-1550269098-956877477611', false, true, true),
((SELECT get_cat_id('Organic')), 'قرنبيط عضوي', 'Organic Cauliflower', 'قرنبيط أبيض عضوي', 30.00, 'piece', 25, 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3', false, true, true),
((SELECT get_cat_id('Organic')), 'بنجر عضوي', 'Organic Beetroot', 'بنجر أحمر عضوي', 15.00, 'kg', 50, 'https://images.unsplash.com/photo-1549445100-34907a7eb97b', false, true, true),
((SELECT get_cat_id('Organic')), 'فاصوليا خضراء عضوية', 'Organic Green Beans', 'فاصوليا خضراء عضوية', 40.00, 'kg', 35, 'https://images.unsplash.com/photo-1567375698348-5d9d5aecebf9', false, true, true),
((SELECT get_cat_id('Organic')), 'ذرة حلوة عضوية', 'Organic Sweet Corn', 'ذرة حلوة طازجة', 15.00, 'piece', 40, 'https://images.unsplash.com/photo-1551754655-cd27e38d2076', false, true, true),

-- 4. Delivery Boxes
((SELECT get_cat_id('Delivery Boxes')), 'صندوق الأسبوع الصغير', 'Small Weekly Box', 'يكفي فردين لمدة أسبوع', 300.00, 'box', 10, 'https://images.unsplash.com/photo-1517726487900-53491f855d0a', true, false, false),
((SELECT get_cat_id('Delivery Boxes')), 'صندوق العائلة الكبير', 'Large Family Box', 'يكفي عائلة 4 أفراد لمدة أسبوع', 600.00, 'box', 10, 'https://images.unsplash.com/photo-1610832958506-aa56368176cf', true, false, false),
((SELECT get_cat_id('Delivery Boxes')), 'صندوق الفاكهة فقط', 'Fruit Only Box', 'تشكيلة فواكه الموسم', 250.00, 'box', 15, 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b', false, false, false),
((SELECT get_cat_id('Delivery Boxes')), 'صندوق الخضار فقط', 'Vegetable Only Box', 'تشكيلة خضروات أساسية', 200.00, 'box', 20, 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7', false, false, false),
((SELECT get_cat_id('Delivery Boxes')), 'صندوق الفطور', 'Breakfast Box', 'أجبان، بيض، وخضروات للإفطار', 180.00, 'box', 15, 'https://images.unsplash.com/photo-1496046164796-0ba71c56fdf1', false, false, false),
((SELECT get_cat_id('Delivery Boxes')), 'صندوق السلطة', 'Salad Box', 'مكونات السلطة الطازجة المتنوعة', 100.00, 'box', 20, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', false, false, false),
((SELECT get_cat_id('Delivery Boxes')), 'صندوق العصائر', 'Juice Box', 'فواكه للعصير (برتقال، جزر، فراولة)', 150.00, 'box', 15, 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a', false, false, false),
((SELECT get_cat_id('Delivery Boxes')), 'صندوق الشواء', 'BBQ Box', 'خضروات للشوي مع توابل', 120.00, 'box', 10, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', false, false, false),
((SELECT get_cat_id('Delivery Boxes')), 'صندوق الحمية', 'Diet Box', 'خضروات وفاكهة قليلة السعرات', 220.00, 'box', 10, 'https://images.unsplash.com/photo-1490645935967-10de6ba17061', false, false, false),
((SELECT get_cat_id('Delivery Boxes')), 'صندوق الأطفال', 'Kids Box', 'فواكه صغيرة وسناكس صحية', 160.00, 'box', 15, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', false, false, false),

-- 5. Nuts & Seeds (Adding more)
((SELECT get_cat_id('Nuts & Seeds')), 'عين جمل', 'Walnuts', 'عين جمل مقشر فاخر', 300.00, 'kg', 25, 'https://images.unsplash.com/photo-1574315264860-29c8fb995669', false, false, false),
((SELECT get_cat_id('Nuts & Seeds')), 'بندق', 'Hazelnuts', 'بندق محمص', 280.00, 'kg', 30, 'https://images.unsplash.com/photo-1510499256955-4688974a625a', false, false, false),
((SELECT get_cat_id('Nuts & Seeds')), 'لب سوبر', 'Melon Seeds', 'لب سوبر محمص مملح', 120.00, 'kg', 50, 'https://images.unsplash.com/photo-1520038410233-7141dd7e6f55', false, false, true),
((SELECT get_cat_id('Nuts & Seeds')), 'لب عباد الشمس', 'Sunflower Seeds', 'لب عباد الشمس محمص', 80.00, 'kg', 60, 'https://images.unsplash.com/photo-1525916056525-455648ed829b', false, false, true),
((SELECT get_cat_id('Nuts & Seeds')), 'سمسم', 'Sesame Seeds', 'سمسم أبيض نظيف', 60.00, 'kg', 40, 'https://images.unsplash.com/photo-1529949987071-6c2ce8018e63', false, false, false),
((SELECT get_cat_id('Nuts & Seeds')), 'بذور شيا', 'Chia Seeds', 'بذور شيا عضوية', 150.00, 'kg', 20, 'https://images.unsplash.com/photo-1523420808389-994119d5c411', false, true, false),
((SELECT get_cat_id('Nuts & Seeds')), 'بذور كتان', 'Flax Seeds', 'بذور كتان للتخسيس', 40.00, 'kg', 30, 'https://images.unsplash.com/photo-1634547211119-943e0616b252', false, false, false),
((SELECT get_cat_id('Nuts & Seeds')), 'فول سوداني', 'Peanuts', 'فول سوداني بقشره', 40.00, 'kg', 80, 'https://images.unsplash.com/photo-1558486012-817176f84c6d', false, false, true),
((SELECT get_cat_id('Nuts & Seeds')), 'مكسرات مشكلة', 'Mixed Nuts', 'مكسرات مشكلة فاخرة', 240.00, 'kg', 40, 'https://images.unsplash.com/photo-1600189334882-c67d6dfdf7c1', true, false, false),
((SELECT get_cat_id('Nuts & Seeds')), 'زبيب', 'Raisins', 'زبيب ذهبي', 90.00, 'kg', 50, 'https://images.unsplash.com/photo-1637500989010-0254247551cc', false, false, false),

-- 6. Milk & Cheese (Adding more)
((SELECT get_cat_id('Milk & Cheese')), 'جبنة رومي', 'Romy Cheese', 'جبنة رومي قديمة', 180.00, 'kg', 40, 'https://images.unsplash.com/photo-1634487359989-3e31215b2447', false, false, true),
((SELECT get_cat_id('Milk & Cheese')), 'جبنة شيدر', 'Cheddar Cheese', 'جبنة شيدر مستوردة', 220.00, 'kg', 30, 'https://images.unsplash.com/photo-1628178873752-641575ca2446', false, false, false),
((SELECT get_cat_id('Milk & Cheese')), 'زبدة فلاحي', 'Farm Butter', 'زبدة فلاحي طبيعية', 160.00, 'kg', 25, 'https://images.unsplash.com/photo-1598911545625-f71694d930c2', false, true, true),
((SELECT get_cat_id('Milk & Cheese')), 'قشطة', 'Cream', 'قشطة طازجة', 120.00, 'kg', 20, 'https://images.unsplash.com/photo-1627914848611-30de9910d650', false, false, true),
((SELECT get_cat_id('Milk & Cheese')), 'بيض بلدي', 'Local Eggs', 'كرتونة بيض بلدي 30 بيضة', 130.00, 'tray', 50, 'https://images.unsplash.com/photo-1582722878654-02fd2374bb7b', false, false, true),
((SELECT get_cat_id('Milk & Cheese')), 'بيض أحمر', 'Red Eggs', 'كرتونة بيض أحمر', 120.00, 'tray', 60, 'https://images.unsplash.com/photo-1598346762291-aee88549193f', false, false, true),
((SELECT get_cat_id('Milk & Cheese')), 'لبن رايب', 'Buttermilk', 'لبن رايب طبيعي', 20.00, 'liter', 40, 'https://images.unsplash.com/photo-1626127341902-6997d928274d', false, false, true),
((SELECT get_cat_id('Milk & Cheese')), 'جبنة قريش', 'Cottage Cheese', 'جبنة قريش دايت', 40.00, 'kg', 30, 'https://images.unsplash.com/photo-1528750997573-59b8b6dd580c', false, false, true),
((SELECT get_cat_id('Milk & Cheese')), 'مش', 'Mish Cheese', 'مش صعيدي قديم', 50.00, 'kg', 20, 'https://images.unsplash.com/photo-1563288417-64052303c20c', false, false, true),
((SELECT get_cat_id('Milk & Cheese')), 'سمنة بلدي', 'Local Ghee', 'سمنة بلدي جاموسي', 280.00, 'kg', 15, 'https://images.unsplash.com/photo-1616167822971-ce4f971c2619', false, false, true),

-- 7. Intelligence Tests (Placeholder products for this unique category)
((SELECT get_cat_id('Intelligence Tests')), 'اختبار الذكاء العام', 'General IQ Test', 'اختبار شامل لقياس معدل الذكاء', 100.00, 'test', 999, 'https://images.unsplash.com/photo-1555431189-0fabf2667795', false, false, false),
((SELECT get_cat_id('Intelligence Tests')), 'اختبار الذاكرة', 'Memory Test', 'اختبار لقياس قوة الذاكرة', 50.00, 'test', 999, 'https://images.unsplash.com/photo-1555431189-0fabf2667795', false, false, false),
((SELECT get_cat_id('Intelligence Tests')), 'ألغاز منطقية', 'Logic Puzzles', 'مجموعة ألغاز لتنشيط العقل', 30.00, 'book', 50, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b', false, false, false),
((SELECT get_cat_id('Intelligence Tests')), 'مكعب روبيك', 'Rubik Cube', 'مكعب روبيك أصلي', 150.00, 'piece', 40, 'https://images.unsplash.com/photo-1560769634-fac4b5dad1b2', false, false, false),
((SELECT get_cat_id('Intelligence Tests')), 'شطرنج خشبي', 'Wooden Chess', 'رقعة شطرنج خشبية فاخرة', 400.00, 'set', 10, 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b', false, false, false),
((SELECT get_cat_id('Intelligence Tests')), 'سودوكو', 'Sudoku Book', 'كتاب سودوكو للمحترفين', 40.00, 'book', 60, 'https://images.unsplash.com/photo-1588663806786-82ae97920199', false, false, false),
((SELECT get_cat_id('Intelligence Tests')), 'دومينو', 'Domino Set', 'لعبة دومينو كلاسيكية', 80.00, 'set', 30, 'https://images.unsplash.com/photo-1566699104051-540c495e4fd9', false, false, false),
((SELECT get_cat_id('Intelligence Tests')), 'بازل 1000 قطعة', 'Puzzle 1000pcs', 'لعبة تركيب صور معقدة', 200.00, 'set', 20, 'https://images.unsplash.com/photo-1510250646049-9f796d11e9a2', false, false, false),
((SELECT get_cat_id('Intelligence Tests')), 'لعبة الذاكرة للأطفال', 'Kids Memory Game', 'لعبة كروت لتنمية الذاكرة', 60.00, 'set', 40, 'https://images.unsplash.com/photo-1611707664673-9e45d629f600', false, false, false),
((SELECT get_cat_id('Intelligence Tests')), 'كتب تنمية بشرية', 'Self Development Books', 'مجموعة كتب لتطوير الذات', 300.00, 'set', 15, 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7', false, false, false),

-- 8. Download App (This seems like a promo category, maybe digital goods or app subscriptions)
((SELECT get_cat_id('Download App')), 'اشتراك بريميوم - شهر', 'Premium Sub - 1 Month', 'اشتراك شهري في التطبيق بدون اعلانات', 50.00, 'month', 9999, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', true, false, false),
((SELECT get_cat_id('Download App')), 'اشتراك بريميوم - سنة', 'Premium Sub - 1 Year', 'اشتراك سنوي مع خصم', 500.00, 'year', 9999, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', true, false, false),
((SELECT get_cat_id('Download App')), 'استشارة غذائية', 'Nutrition Consult', 'استشارة مع خبير تغذية عبر التطبيق', 150.00, 'session', 999, 'https://images.unsplash.com/photo-1576091160550-217358c7db81', false, false, false),
((SELECT get_cat_id('Download App')), 'خطة وجبات', 'Meal Plan', 'خطة وجبات أسبوعية مخصصة', 200.00, 'plan', 999, 'https://images.unsplash.com/photo-1490645935967-10de6ba17061', false, false, false),
((SELECT get_cat_id('Download App')), 'توصيل مجاني - شهر', 'Free Delivery - 1 Month', 'باقة التوصيل المجاني لمدة شهر', 100.00, 'month', 999, 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8', false, false, false),
((SELECT get_cat_id('Download App')), 'نقاط ولاء 1000', '1000 Loyalty Points', 'شراء نقاط ولاء إضافية', 50.00, 'points', 9999, 'https://images.unsplash.com/photo-1563013544-824ae1b704d3', false, false, false),
((SELECT get_cat_id('Download App')), 'كوبون خصم', 'Discount Coupon', 'كوبون خصم 20%', 20.00, 'coupon', 100, 'https://images.unsplash.com/photo-1598449356475-b9f71db7d847', false, false, false),
((SELECT get_cat_id('Download App')), 'دعم فني أولوي', 'Priority Support', 'أولوية في خدمة العملاء', 30.00, 'service', 999, 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d', false, false, false),
((SELECT get_cat_id('Download App')), 'تقرير تحليلي', 'Analytics Report', 'تقرير عن مشترياتك وصحتك', 40.00, 'report', 999, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', false, false, false),
((SELECT get_cat_id('Download App')), 'تبرع خيري', 'Charity Donation', 'تبرع بوجبة لمحتاج', 50.00, 'meal', 9999, 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6', false, false, false);

-- Drop the temporary function
DROP FUNCTION get_cat_id;
