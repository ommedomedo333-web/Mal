import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'full-products-data.json');

const categories = [
    { "id": 1, "name": "مكسرات & ياميش", "icon": "🥜", "description": "مكسرات وياميش فاخرة من أفضل المصادر" },
    { "id": 2, "name": "خضروات", "icon": "🥦", "description": "خضروات طازجة يومياً" },
    { "id": 3, "name": "فواكه", "icon": "🍎", "description": "فواكه طازجة ومستوردة من أجود الأصناف" },
    { "id": 4, "name": "تمور", "icon": "🌴", "description": "تمور سعودية ومصرية وعراقية فاخرة" },
    { "id": 5, "name": "زيوت & عسل", "icon": "🍯", "description": "زيوت طبيعية وعسل نقي" },
    { "id": 6, "name": "ورقيات", "icon": "🥬", "description": "خضروات ورقية طازجة" },
    { "id": 7, "name": "مجمدات", "icon": "❄️", "description": "منتجات مجمدة عالية الجودة" },
    { "id": 8, "name": "البان", "icon": "🥛", "description": "منتجات ألبان طازجة" },
    { "id": 9, "name": "عصير", "icon": "🧃", "description": "عصائر طبيعية ومركزة" },
    { "id": 10, "name": "فواكه مجففه", "icon": "🍒", "description": "فواكه مجففة طبيعية" },
    { "id": 11, "name": "فريش", "icon": "🥗", "description": "منتجات فريش وجاهزة" },
    { "id": 12, "name": "اخرى", "icon": "🛒", "description": "منتجات متنوعة أخرى" }
];

const products = [
    { "id": 1, "name": "كاجو هندي", "category": "مكسرات & ياميش", "price": 120, "unit": "كيلو", "barcode": "6223001531647", "image": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", "description": "كاجو هندي فاخر من أفضل المصادر", "rating": 5 },
    { "id": 2, "name": "لوز إيراني", "category": "مكسرات & ياميش", "price": 85, "unit": "كيلو", "barcode": "", "image": "https://images.unsplash.com/photo-1574570068036-a4f98b6e29fc?w=400", "description": "لوز إيراني طازج ومحمص", "rating": 5 },
    { "id": 3, "name": "فستق حلبي", "category": "مكسرات & ياميش", "price": 200, "unit": "كيلو", "barcode": "", "image": "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400", "description": "فستق حلبي أصيل من أجود الأصناف", "rating": 5 },
    { "id": 4, "name": "زبيب أخضر", "category": "مكسرات & ياميش", "price": 55, "unit": "كيلو", "barcode": "", "image": "https://images.unsplash.com/photo-1515705576963-95cad62945b6?w=400", "description": "زبيب أخضر طبيعي", "rating": 5 },
    { "id": 5, "name": "بندق 250جم", "category": "مكسرات & ياميش", "price": 150, "unit": "قطعه", "barcode": "9049959750988", "image": "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400", "description": "بندق طازج 250 جرام", "rating": 4 },
    { "id": 6, "name": "بندق مقشر 250جم", "category": "مكسرات & ياميش", "price": 165, "unit": "قطعه", "barcode": "7371196751735", "image": "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400", "description": "بندق مقشر 250 جرام", "rating": 4 },
    { "id": 7, "name": "لوز 225جم", "category": "مكسرات & ياميش", "price": 0, "unit": "قطعه", "barcode": "4823596137495", "image": "https://images.unsplash.com/photo-1574570068036-a4f98b6e29fc?w=400", "description": "لوز خام 225 جرام", "rating": 4 },
    { "id": 8, "name": "فسدق 225جم", "category": "مكسرات & ياميش", "price": 0, "unit": "قطعه", "barcode": "5204553972110", "image": "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400", "description": "فستق محار 225 جرام", "rating": 4 },
    { "id": 9, "name": "ابو فرو 300جم", "category": "مكسرات & ياميش", "price": 70, "unit": "قطعه", "barcode": "6114027670062", "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", "description": "أبو فرو بذور القرع 300 جرام", "rating": 4 },
    { "id": 10, "name": "زبيب ذهبي 250جم", "category": "مكسرات & ياميش", "price": 70, "unit": "قطعه", "barcode": "3384009016994", "image": "https://images.unsplash.com/photo-1515705576963-95cad62945b6?w=400", "description": "زبيب ذهبي ممتاز 250 جرام", "rating": 4 },
    { "id": 11, "name": "صنوبر 250جم", "category": "مكسرات & ياميش", "price": 0, "unit": "قطعه", "barcode": "1572398368417", "image": "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400", "description": "بذور الصنوبر الطازجة 250 جرام", "rating": 4 },
    { "id": 12, "name": "كاجو 250جم", "category": "مكسرات & ياميش", "price": 0, "unit": "قطعه", "barcode": "5173622285133", "image": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", "description": "كاجو طازج 250 جرام", "rating": 4 },
    { "id": 13, "name": "عين جمل 200جم مقشر", "category": "مكسرات & ياميش", "price": 0, "unit": "قطعه", "barcode": "6321133398715", "image": "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400", "description": "جوز مقشر 200 جرام", "rating": 4 },
    { "id": 14, "name": "مكسرات مشكل 250جم", "category": "مكسرات & ياميش", "price": 0, "unit": "قطعه", "barcode": "2008993989515", "image": "https://images.unsplash.com/photo-1559181567-c3190bea4b84?w=400", "description": "مزيج مكسرات متنوعة 250 جرام", "rating": 5 },
    { "id": 15, "name": "كاجو محمص جنيا 140جم", "category": "مكسرات & ياميش", "price": 160, "unit": "قطعه", "barcode": "", "image": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", "description": "كاجو محمص فاخر 140 جرام", "rating": 5 },
    { "id": 16, "name": "لوز محمص جنيا 150جم", "category": "مكسرات & ياميش", "price": 150, "unit": "قطعه", "barcode": "", "image": "https://images.unsplash.com/photo-1574570068036-a4f98b6e29fc?w=400", "description": "لوز محمص فاخر 150 جرام", "rating": 5 },
    { "id": 17, "name": "فستق محمص جنيا 100جم", "category": "مكسرات & ياميش", "price": 125, "unit": "قطعه", "barcode": "", "image": "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400", "description": "فستق محمص فاخر 100 جرام", "rating": 5 },
    { "id": 18, "name": "حلاوة طحينية بالبندق 500جم", "category": "مكسرات & ياميش", "price": 0, "unit": "قطعه", "barcode": "5852515445556", "image": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400", "description": "حلاوة طحينية بالبندق أردهان 500 جرام", "rating": 4 },
    { "id": 19, "name": "حلاوة طحينية بالفستق 500جم", "category": "مكسرات & ياميش", "price": 0, "unit": "قطعه", "barcode": "5748054631867", "image": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400", "description": "حلاوة طحينية بالفستق أردهان 500 جرام", "rating": 4 },
    { "id": 20, "name": "حلاوة طحينية باللوز 500جم", "category": "مكسرات & ياميش", "price": 0, "unit": "قطعه", "barcode": "6581606603955", "image": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400", "description": "حلاوة طحينية باللوز أردهان 500 جرام", "rating": 4 },
    { "id": 21, "name": "حلاوة طحينية سادة 500جم", "category": "مكسرات & ياميش", "price": 0, "unit": "قطعه", "barcode": "6387488740111", "image": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400", "description": "حلاوة طحينية سادة أردهان 500 جرام", "rating": 4 },
    { "id": 101, "name": "طماطم", "category": "خضروات", "price": 8, "unit": "كيلو", "barcode": "10002", "image": "https://images.unsplash.com/photo-1546470427-0d4e0a7b0e2a?w=400", "description": "طماطم طازجة يومية", "rating": 4 }
];

const result = {
    store: "CyberNav Hub",
    categories,
    products
};

fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
console.log(`Generated JSON with ${products.length} products.`);
