-- ========================================
-- إنشاء مستخدم Admin بسرعة
-- ========================================
-- ⚠️ هذا السكريبت للتطوير فقط!
-- في الإنتاج، استخدم Supabase Dashboard لإنشاء المستخدمين

-- الطريقة الصحيحة: استخدم Supabase Dashboard
-- Authentication → Users → Add User
-- Email: admin@gmail.com
-- Password: 123456
-- ✅ Auto Confirm User

-- ========================================
-- إعداد Storage Bucket للصور
-- ========================================

-- إنشاء Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- سياسات الرفع والعرض (للتطوير - مفتوحة للجميع)
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete images" ON storage.objects;

CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

-- ========================================
-- التحقق من جدول المستخدمين
-- ========================================

-- إنشاء جدول المستخدمين إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تفعيل RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- سياسات الوصول
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

CREATE POLICY "Users can view own data"
ON public.users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
ON public.users FOR UPDATE
USING (auth.uid() = id);

-- ========================================
-- ملاحظات مهمة
-- ========================================

-- ✅ بعد تنفيذ هذا السكريبت:
-- 1. اذهب إلى Supabase Dashboard
-- 2. Authentication → Users → Add User
-- 3. أدخل:
--    - Email: admin@gmail.com
--    - Password: 123456
--    - ✅ Auto Confirm User
-- 4. سيتم إنشاء سجل تلقائياً في جدول users

-- ✅ للتحقق من نجاح الإعداد:
SELECT * FROM storage.buckets WHERE id = 'product-images';
SELECT * FROM auth.users WHERE email = 'admin@gmail.com';
