# 🔧 حل مشكلة الأقسام - عدم عرض المنتجات

## المشكلة
عند الضغط على أي قسم (مثل: العروض الخاصة، فواكه مستوردة، إلخ)، يعود التطبيق للصفحة الرئيسية بدلاً من عرض المنتجات.

---

## ✅ الحل الكامل (خطوة بخطوة)

### الخطوة 1: إضافة البيانات الكاملة
قم بتشغيل الملف `complete-products-data.sql` في Supabase:

1. افتح Supabase Dashboard
2. اذهب إلى **SQL Editor**
3. انقر **New Query**
4. انسخ محتوى ملف `complete-products-data.sql` بالكامل
5. الصق في المحرر
6. انقر **Run**

سيضيف هذا:
- ✅ **15 قسم** كامل مع أيقونات وألوان
- ✅ **200+ منتج** موزعة على جميع الأقسام
- ✅ كل المنتجات بصور وأسعار وتقييمات حقيقية

---

### الخطوة 2: التحقق من إضافة البيانات

قم بتشغيل هذه الاستعلامات للتأكد:

```sql
-- 1. عدد الأقسام (يجب أن يكون 15)
SELECT COUNT(*) FROM categories;

-- 2. عدد المنتجات في كل قسم
SELECT 
  c.name_ar, 
  COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name_ar
ORDER BY c.display_order;

-- 3. عرض المنتجات في قسم "العروض الخاصة"
SELECT name_ar, price, discount_percent 
FROM products 
WHERE category_id = (SELECT id FROM categories WHERE name_ar = 'العروض الخاصة')
LIMIT 5;
```

**النتائج المتوقعة:**
- العروض الخاصة: 10 منتجات
- فواكه مستوردة: 15 منتج
- خضروات طازجة: 25 منتج
- وجبات خفيفة: 15 منتج
- وصل حديثاً: 10 منتجات
- منتجات محلية: 15 منتج
- عضوي: 15 منتج
- صناديق التوفير: 10 منتجات
- حصري التطبيق: 10 منتجات
- وأكثر...

---

### الخطوة 3: التحقق من كود التطبيق

تأكد من أن كود React Native يجلب المنتجات بشكل صحيح:

```javascript
// في ملف CategoriesScreen.tsx أو ما شابه

import { productService } from '../services/supabaseService';

const loadCategoryProducts = async (categoryId) => {
  try {
    const result = await productService.getProductsByCategory(categoryId);
    
    if (result.success) {
      setProducts(result.data);
      console.log(`تم جلب ${result.data.length} منتج`);
    } else {
      console.error('خطأ:', result.error);
    }
  } catch (error) {
    console.error('خطأ في جلب المنتجات:', error);
  }
};
```

---

### الخطوة 4: التحقق من التنقل (Navigation)

تأكد من أن التنقل للأقسام يعمل:

```javascript
// عند الضغط على قسم
const handleCategoryPress = (category) => {
  navigation.navigate('ProductsList', {
    categoryId: category.id,
    categoryName: category.name_ar,
  });
};

// في شاشة ProductsList
const ProductsListScreen = ({ route }) => {
  const { categoryId, categoryName } = route.params;
  
  useEffect(() => {
    loadProducts(categoryId);
  }, [categoryId]);
  
  // ... باقي الكود
};
```

---

## 🔍 الأسباب الشائعة للمشكلة

### السبب 1: لا توجد منتجات في القسم
**الحل:** قم بتشغيل ملف `complete-products-data.sql`

### السبب 2: خطأ في معرف القسم (category_id)
**الحل:** تحقق من أن category_id يُرسل بشكل صحيح:
```javascript
console.log('Category ID:', categoryId);
```

### السبب 3: خطأ في RLS Policies
**الحل:** تحقق من سياسات الأمان:
```sql
-- تحقق من وجود السياسات
SELECT * FROM pg_policies WHERE tablename = 'products';

-- أو قم بتعطيل RLS مؤقتاً للاختبار (غير آمن للإنتاج)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```

### السبب 4: خطأ في API Call
**الحل:** تحقق من الاستعلام:
```javascript
// في supabaseService.js
getProductsByCategory: async (categoryId) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .eq('is_in_stock', true);
  
  console.log('Products:', data);
  console.log('Error:', error);
  
  return { success: !error, data, error: error?.message };
}
```

---

## 📊 اختبار سريع في Supabase

قم بتشغيل هذا الاستعلام لرؤية المنتجات في كل قسم:

```sql
-- عرض كل الأقسام مع عدد المنتجات
WITH category_products AS (
  SELECT 
    c.name_ar as القسم,
    c.name_en as Category,
    COUNT(p.id) as عدد_المنتجات,
    c.color as اللون,
    c.icon as الأيقونة
  FROM categories c
  LEFT JOIN products p ON c.id = p.category_id
  WHERE c.is_active = true
    AND (p.is_active = true OR p.id IS NULL)
  GROUP BY c.id, c.name_ar, c.name_en, c.color, c.icon, c.display_order
  ORDER BY c.display_order
)
SELECT * FROM category_products;
```

---

## 🎯 نقاط تفتيش سريعة

- [ ] هل تم تشغيل ملف `complete-products-data.sql` بنجاح؟
- [ ] هل يظهر 15 قسم في جدول `categories`؟
- [ ] هل يوجد 200+ منتج في جدول `products`؟
- [ ] هل كل قسم يحتوي على منتجات؟
- [ ] هل `category_id` يُربط بشكل صحيح؟
- [ ] هل سياسات RLS تسمح بالوصول للبيانات؟
- [ ] هل التنقل (Navigation) مضبوط بشكل صحيح؟

---

## 💡 نصيحة إضافية

إذا كنت تريد رؤية البيانات فوراً في التطبيق:

1. أعد تشغيل التطبيق بالكامل:
```bash
# React Native
npm start -- --reset-cache

# أو
expo start -c
```

2. تحقق من Console في التطبيق:
```javascript
// أضف هذا في الكود مؤقتاً للتصحيح
console.log('Categories:', categories);
console.log('Products:', products);
```

---

## ✅ النتيجة المتوقعة

بعد تطبيق هذه الخطوات:
- ✅ عند الضغط على "العروض الخاصة" → ترى 10 منتجات بخصومات
- ✅ عند الضغط على "فواكه مستوردة" → ترى 15 منتج فاخر
- ✅ عند الضغط على "خضروات طازجة" → ترى 25 منتج خضار
- ✅ كل قسم يعرض منتجاته الخاصة بشكل صحيح

---

## 🆘 ما زالت المشكلة موجودة؟

إذا استمرت المشكلة بعد تطبيق كل الخطوات:

1. **تحقق من Logs:**
```bash
# في Terminal
npx react-native log-android
# أو
npx react-native log-ios
```

2. **تحقق من Network Tab في Chrome DevTools:**
- افتح Chrome DevTools
- اذهب لـ Network Tab
- شاهد الطلبات للـ Supabase API

3. **أرسل رسالة الخطأ الكاملة** مع:
   - رسالة الخطأ من Console
   - كود Navigation
   - كود جلب المنتجات

---

**جاهز للتجربة! 🚀**
