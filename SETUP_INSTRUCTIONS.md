# 🚀 تعليمات الإعداد - Cybernav Hub

## المشاكل الحالية والحلول

### ❌ المشكلة 1: Invalid API Key للمساعد الذكي
**السبب:** مفتاح OpenRouter غير صالح أو منتهي الصلاحية

**الحل:**
1. افتح ملف `.env.local`
2. استبدل المفتاح الحالي بمفتاح جديد من [OpenRouter](https://openrouter.ai/keys)
3. أو احذف السطر تماماً لاستخدام Gemini API فقط

```env
# في ملف .env.local
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-YOUR-NEW-KEY-HERE
```

**بديل:** استخدام Google Gemini فقط (المفتاح موجود بالفعل في `.env`)

---

### ❌ المشكلة 2: لا يمكن تسجيل الدخول بـ admin@gmail.com

**السبب:** المستخدم غير موجود في قاعدة بيانات Supabase

**الحل - الخطوات:**

#### 1️⃣ إنشاء المستخدم في Supabase Dashboard

افتح [Supabase Dashboard](https://supabase.com/dashboard) → اختر مشروعك → Authentication → Users → Add User

**البيانات المطلوبة:**
- Email: `admin@gmail.com`
- Password: `123456`
- ✅ Auto Confirm User (مهم جداً!)

#### 2️⃣ تحديث مفتاح Supabase Anon Key

المفتاح الحالي في `.env` يبدو غير كامل. اتبع الخطوات:

1. افتح [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك: `qjzpjleztbqauxxjvnqr`
3. اذهب إلى: Settings → API
4. انسخ `anon` / `public` key الكامل
5. استبدله في ملف `.env`:

```env
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqenBqbGV6dGJxYXV4eGp2bnFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0ODU0NDAsImV4cCI6MjA1NTA2MTQ0MH0.PASTE-THE-REAL-SIGNATURE-HERE
```

#### 3️⃣ تنفيذ Schema في Supabase

افتح SQL Editor في Supabase Dashboard وقم بتنفيذ:

```sql
-- إنشاء جدول المستخدمين إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء Bucket للصور
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- السماح برفع الصور للجميع (للتطوير فقط)
CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
```

---

## ✅ التحقق من الإعداد

بعد تطبيق الحلول أعلاه:

### 1. اختبار تسجيل الدخول
```
1. افتح: http://localhost:4176/#/login
2. أدخل:
   - Email: admin@gmail.com
   - Password: 123456
3. اضغط "تسجيل الدخول"
4. يجب أن يتم توجيهك إلى /admin
```

### 2. اختبار المساعد الذكي
```
1. افتح: http://localhost:4176/#/ai-assistant
2. اكتب سؤال مثل: "ما هي المنتجات المتاحة؟"
3. يجب أن يرد المساعد بدون خطأ "Invalid API key"
```

### 3. اختبار رفع الصور
```
1. افتح: http://localhost:4176/#/admin
2. اضغط "إضافة منتج"
3. جرب رفع صورة
4. يجب أن يتم الرفع بنجاح
```

---

## 🔧 إعادة البناء بعد التعديلات

إذا قمت بتعديل ملفات `.env`:

```bash
npm run build
npm run preview
```

---

## 📞 المساعدة

إذا استمرت المشاكل:

1. **تحقق من Console في المتصفح** (F12)
2. **تحقق من Supabase Logs**: Dashboard → Logs
3. **تأكد من صحة جميع المفاتيح**

---

## 🎯 الملفات المهمة

- `.env` - مفاتيح Supabase و Gemini
- `.env.local` - مفتاح OpenRouter
- `src/supabase/database-schema.sql` - Schema كامل للقاعدة
- `src/supabase/supabase-config.js` - إعدادات الاتصال

---

**ملاحظة:** إذا كنت لا تريد استخدام تسجيل الدخول، فالداشبورد يعمل بدون تسجيل دخول حالياً (Guest Mode).
