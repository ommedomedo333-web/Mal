import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// قراءة بيانات البيئة
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ خطأ: لم يتم العثور على بيانات Supabase في متغيرات البيئة');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// قراءة ملف البيانات الكامل من المستخدم
const fullDataPath = path.join(__dirname, 'full-products-data.json');
let fullData;

try {
    let rawData = fs.readFileSync(fullDataPath, 'utf8');
    // تنظيف BOM إذا وجد
    rawData = rawData.replace(/^\uFEFF/, '');
    fullData = JSON.parse(rawData);
} catch (error) {
    console.error('❌ خطأ في قراءة ملف البيانات:', error.message);
    process.exit(1);
}

// دالة لتنظيف النص العربي
function normalizeArabic(text) {
    if (!text) return '';
    return text
        .replace(/[أإآ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .trim();
}

// دالة لجلب خارطة الأقسام من قاعدة البيانات
async function getCategoriesMap() {
    const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name_ar');

    if (error) {
        console.error('❌ خطأ في جلب الأقسام:', error.message);
        return {};
    }

    const map = {};
    categories.forEach(cat => {
        map[normalizeArabic(cat.name_ar)] = cat.id;
    });
    return map;
}

async function importCategories() {
    console.log('\n🔄 جاري إضافة الأقسام...\n');

    const categories = [
        {
            name_ar: 'مكسرات & ياميش',
            name_en: 'Nuts & Dried Fruits',
            icon_name: '🥜',
            description_ar: 'مكسرات وياميش فاخرة من أفضل المصادر',
            color: '#003e31',
            accent: '#db6a28',
            dark: '#001a14',
            display_order: 1,
            is_active: true
        },
        {
            name_ar: 'خضروات',
            name_en: 'Vegetables',
            icon_name: '🥦',
            description_ar: 'خضروات طازجة يومياً',
            color: '#003e31',
            accent: '#db6a28',
            dark: '#001a14',
            display_order: 2,
            is_active: true
        },
        {
            name_ar: 'فواكه',
            name_en: 'Fruits',
            icon_name: '🍎',
            description_ar: 'فواكه طازجة ومستوردة من أجود الأصناف',
            color: '#003e31',
            accent: '#db6a28',
            dark: '#001a14',
            display_order: 3,
            is_active: true
        },
        {
            name_ar: 'تمور',
            name_en: 'Dates',
            icon_name: '🌴',
            description_ar: 'تمور سعودية ومصرية وعراقية فاخرة',
            color: '#003e31',
            accent: '#db6a28',
            dark: '#001a14',
            display_order: 4,
            is_active: true
        },
        {
            name_ar: 'زيوت & عسل',
            name_en: 'Oils & Honey',
            icon_name: '🍯',
            description_ar: 'زيوت طبيعية وعسل نقي',
            color: '#003e31',
            accent: '#db6a28',
            dark: '#001a14',
            display_order: 5,
            is_active: true
        },
        {
            name_ar: 'ورقيات',
            name_en: 'Leafy Greens',
            icon_name: '🥬',
            description_ar: 'خضروات ورقية طازجة',
            color: '#003e31',
            accent: '#db6a28',
            dark: '#001a14',
            display_order: 6,
            is_active: true
        },
        {
            name_ar: 'مجمدات',
            name_en: 'Frozen',
            icon_name: '❄️',
            description_ar: 'منتجات مجمدة عالية الجودة',
            color: '#003e31',
            accent: '#db6a28',
            dark: '#001a14',
            display_order: 7,
            is_active: true
        },
        {
            name_ar: 'ألبان',
            name_en: 'Dairy',
            icon_name: '🥛',
            description_ar: 'منتجات ألبان طازجة',
            color: '#003e31',
            accent: '#db6a28',
            dark: '#001a14',
            display_order: 8,
            is_active: true
        },
        {
            name_ar: 'عصير',
            name_en: 'Juices',
            icon_name: '🧃',
            description_ar: 'عصائر طبيعية ومركزة',
            color: '#003e31',
            accent: '#db6a28',
            dark: '#001a14',
            display_order: 9,
            is_active: true
        },
        {
            name_ar: 'فواكه مجففة',
            name_en: 'Dried Fruits',
            icon_name: '🍒',
            description_ar: 'فواكه مجففة طبيعية',
            color: '#003e31',
            accent: '#db6a28',
            dark: '#001a14',
            display_order: 10,
            is_active: true
        },
        {
            name_ar: 'فريش',
            name_en: 'Fresh',
            icon_name: '🥗',
            description_ar: 'منتجات فريش وجاهزة',
            color: '#003e31',
            accent: '#db6a28',
            dark: '#001a14',
            display_order: 11,
            is_active: true
        },
        {
            name_ar: 'أخرى',
            name_en: 'Others',
            icon_name: '🛒',
            description_ar: 'منتجات متنوعة أخرى',
            color: '#003e31',
            accent: '#db6a28',
            dark: '#001a14',
            display_order: 12,
            is_active: true
        }
    ];

    for (const category of categories) {
        const { data, error } = await supabase
            .from('categories')
            .upsert(category, { onConflict: 'name_ar' })
            .select();

        if (error) {
            console.error(`❌ خطأ في إضافة قسم ${category.name_ar}:`, error.message);
        } else {
            console.log(`✅ تم إضافة قسم: ${category.name_ar}`);
        }
    }
}

async function importProducts() {
    console.log('\n🔄 جلب خارطة الأقسام من قاعدة البيانات...\n');
    const categoryMap = await getCategoriesMap();

    console.log('\n🔄 جاري إضافة المنتجات...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const product of fullData.products) {
        const categoryId = categoryMap[normalizeArabic(product.category)];

        if (!categoryId) {
            console.error(`❌ لم يتم العثور على القسم: ${product.category} للمنتج ${product.name}`);
            errorCount++;
            continue;
        }

        const productData = {
            name_ar: product.name,
            name_en: product.name, // يمكن تحديثه لاحقاً
            category_id: categoryId,
            price: product.price || 0,
            unit: product.unit || 'قطعة',
            barcode: product.barcode || '',
            image_url: product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
            description_ar: product.description || '',
            description_en: product.description || '',
            rating: product.rating || 4,
            is_available: true,
            stock_quantity: 100,
            points: Math.round((product.price || 0) * 10)
        };

        const { data, error } = await supabase
            .from('products')
            .upsert(productData, { onConflict: 'name_ar' })
            .select();

        if (error) {
            console.error(`❌ خطأ في إضافة منتج ${product.name}:`, error.message);
            errorCount++;
        } else {
            successCount++;
            if (successCount % 10 === 0) {
                console.log(`✅ تم إضافة ${successCount} منتج...`);
            }
        }
    }

    console.log(`\n✅ تم إضافة ${successCount} منتج بنجاح`);
    if (errorCount > 0) {
        console.log(`❌ فشل إضافة ${errorCount} منتج`);
    }
}

async function main() {
    console.log('🚀 بدء عملية استيراد البيانات إلى Supabase...\n');

    try {
        await importCategories();
        await importProducts();

        console.log('\n✅ تمت عملية الاستيراد بنجاح!');
        console.log(`📊 إجمالي المنتجات: ${fullData.products.length}`);
        console.log(`📂 إجمالي الأقسام: 12`);
    } catch (error) {
        console.error('\n❌ حدث خطأ أثناء الاستيراد:', error);
        process.exit(1);
    }
}

main();
