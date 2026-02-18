-- Add Fresh Vegetables Category and Products

-- 1. Insert Category
INSERT INTO public.categories (name_ar, name_en, icon_name, display_order)
VALUES ('خضروات طازجة', 'Fresh Vegetables', 'carrot', 9);

-- 2. Insert Products
DO $$
DECLARE
    v_cat_id UUID;
BEGIN
    SELECT id INTO v_cat_id FROM public.categories WHERE name_en = 'Fresh Vegetables' LIMIT 1;

    INSERT INTO public.products (category_id, name_ar, name_en, description_ar, price, unit, stock_quantity, image_url, is_featured, is_organic, is_local) VALUES
    (v_cat_id, 'طماطم بلدي', 'Fresh Tomatoes', 'طماطم حمراء طازجة للسلطة والطبخ', 10.00, 'kg', 100, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea', true, false, true),
    (v_cat_id, 'خيار طازج', 'Fresh Cucumber', 'خيار أخضر مقرمش طازج', 12.00, 'kg', 80, 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6', false, false, true),
    (v_cat_id, 'فلفل رومي أخضر', 'Green Bell Pepper', 'فلفل رومي أخضر طازج', 15.00, 'kg', 60, 'https://images.unsplash.com/photo-1620023611847-f5dc95ce4ec7', false, false, true),
    (v_cat_id, 'جزر', 'Carrots', 'جزر طازج حلو المذاق', 8.00, 'kg', 120, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37', false, false, true),
    (v_cat_id, 'خس بلدي', 'Lettuce', 'خس طازج للسلطة', 5.00, 'piece', 50, 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1', false, false, true),
    (v_cat_id, 'بصل ذهبي', 'Golden Onion', 'بصل ذهبي للطبخ', 10.00, 'kg', 200, 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc', false, false, true),
    (v_cat_id, 'بطاطس طبخ', 'Cooking Potatoes', 'بطاطس ممتازة للطبخ والصواني', 10.00, 'kg', 250, 'https://images.unsplash.com/photo-1518977676601-b53f82a6b69d', false, false, true),
    (v_cat_id, 'ثوم صيني', 'Garlic', 'ثوم صيني فصوص كبيرة', 30.00, 'kg', 50, 'https://images.unsplash.com/photo-1615477021334-92736149fd7b', false, false, false),
    (v_cat_id, 'سبانخ', 'Spinach', 'حزم سبانخ خضراء طازجة', 8.00, 'bundle', 40, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb', false, false, true),
    (v_cat_id, 'باذنجان عروس', 'Eggplant', 'باذنجان عروس للمحشي', 12.00, 'kg', 60, 'https://images.unsplash.com/photo-1601646761661-0ae2804b4d6b', false, false, true);
END $$;
