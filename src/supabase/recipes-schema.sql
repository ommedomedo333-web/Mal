
-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_ar TEXT,
    content_en TEXT,
    cooking_time_ar TEXT,
    cooking_time_en TEXT,
    image_url TEXT,
    author TEXT DEFAULT 'الأطيب',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON recipes FOR SELECT USING (true);

-- Allow admin write access (using service role or if user is authenticated and has admin role)
-- For simplicity in this demo environment, we'll allow all authenticated users to manage recipes if they are marked as admins
-- But usually, we'd check against a specific role. 
-- The app uses user?.app_metadata?.role === 'admin' check in the UI.

CREATE POLICY "Allow admin manage recipes" ON recipes 
FOR ALL 
TO authenticated 
USING ( (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' );

-- Insert initial dummy data
INSERT INTO recipes (title_ar, title_en, cooking_time_ar, cooking_time_en, image_url, content_ar, content_en)
VALUES 
('سلطة الكينوا بالفواكه', 'Quinoa Fruit Salad', '15 دقيقة', '15 min', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800', 
 'طريقة عمل سلطة الكينوا بالفواكه الطازجة... المقادير: كينوا، فراولة، توت، نعناع، عسل.', 'How to make fresh quinoa fruit salad... Ingredients: Quinoa, strawberries, blueberries, mint, honey.'),

('سموذي الطاقة الأخضر', 'Green Energy Smoothie', '5 دقائق', '5 min', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800',
 'سموذي منعش مليء بالطاقة... المقادير: سبانخ، تفاح أخضر، ليمون، زنجبيل.', 'Refreshing smoothie full of energy... Ingredients: Spinach, green apple, lemon, ginger.'),

('تارت الفواكه الموسمية', 'Seasonal Fruit Tart', '45 دقيقة', '45 min', 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800',
 'تارت الفواكه الفاخر... المقادير: عجينة تارت، كريمة باتيسيير، فواكه موسمية متنوعة.', 'Premium fruit tart... Ingredients: Tart dough, pastry cream, various seasonal fruits.');
