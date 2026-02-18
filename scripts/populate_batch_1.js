import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'full-products-data.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const products1 = [
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
    { "id": 101, "name": "طماطم", "category": "خضروات", "price": 8, "unit": "كيلو", "barcode": "10002", "image": "https://images.unsplash.com/photo-1546470427-0d4e0a7b0e2a?w=400", "description": "طماطم طازجة يومية", "rating": 4 },
    { "id": 102, "name": "طماطم لوكس", "category": "خضروات", "price": 17, "unit": "قطعه", "barcode": "4260748949849", "image": "https://images.unsplash.com/photo-1546470427-0d4e0a7b0e2a?w=400", "description": "طماطم لوكس فاخرة", "rating": 5 },
    { "id": 103, "name": "طماطم شيري 500جم", "category": "خضروات", "price": 45, "unit": "قطعه", "barcode": "5788089193886", "image": "https://images.unsplash.com/photo-1546470427-0d4e0a7b0e2a?w=400", "description": "طماطم شيري حمراء 500 جرام", "rating": 5 },
    { "id": 104, "name": "طبق طماطم 1ك", "category": "خضروات", "price": 20, "unit": "قطعه", "barcode": "4565241140657", "image": "https://images.unsplash.com/photo-1546470427-0d4e0a7b0e2a?w=400", "description": "طبق طماطم 1 كيلو", "rating": 4 },
    { "id": 105, "name": "خيار صوب", "category": "خضروات", "price": 20, "unit": "كيلو", "barcode": "10005", "image": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400", "description": "خيار صوب طازج", "rating": 4 },
    { "id": 106, "name": "خيار بلدي", "category": "خضروات", "price": 0, "unit": "كيلو", "barcode": "10004", "image": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400", "description": "خيار بلدي طازج", "rating": 4 },
    { "id": 107, "name": "طبق خيار لوكس 1ك", "category": "خضروات", "price": 25, "unit": "طبق", "barcode": "3442966834157", "image": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400", "description": "خيار لوكس طازج 1 كيلو", "rating": 5 },
    { "id": 108, "name": "فلفل بلدي أخضر", "category": "خضروات", "price": 25, "unit": "كيلو", "barcode": "10012", "image": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400", "description": "فلفل بلدي أخضر طازج", "rating": 4 },
    { "id": 109, "name": "فلفل بلدي أحمر", "category": "خضروات", "price": 27, "unit": "كيلو", "barcode": "10015", "image": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400", "description": "فلفل بلدي أحمر طازج", "rating": 4 },
    { "id": 110, "name": "فلفل رومي أخضر", "category": "خضروات", "price": 45, "unit": "كيلو", "barcode": "10017", "image": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400", "description": "فلفل رومي أخضر كبير الحجم", "rating": 4 },
    { "id": 111, "name": "طبق فلفل ألوان", "category": "خضروات", "price": 25, "unit": "طبق", "barcode": "", "image": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400", "description": "طبق فلفل ملون متنوع", "rating": 5 },
    { "id": 112, "name": "باذنجان رومي", "category": "خضروات", "price": 18, "unit": "كيلو", "barcode": "10028", "image": "https://images.unsplash.com/photo-1509222796416-4a1fef025a92?w=400", "description": "باذنجان رومي طازج", "rating": 4 },
    { "id": 113, "name": "باذنجان عروس أسود", "category": "خضروات", "price": 23, "unit": "كيلو", "barcode": "10030", "image": "https://images.unsplash.com/photo-1509222796416-4a1fef025a92?w=400", "description": "باذنجان عروس أسود فاخر", "rating": 4 },
    { "id": 114, "name": "باذنجان عروس أبيض", "category": "خضروات", "price": 10, "unit": "كيلو", "barcode": "10032", "image": "https://images.unsplash.com/photo-1509222796416-4a1fef025a92?w=400", "description": "باذنجان عروس أبيض", "rating": 4 },
    { "id": 115, "name": "كوسة لوكس", "category": "خضروات", "price": 20, "unit": "قطعه", "barcode": "6054982790095", "image": "https://images.unsplash.com/photo-1583687760622-95ea3f0c5d44?w=400", "description": "كوسة لوكس طازجة", "rating": 5 },
    { "id": 116, "name": "طبق كوسة 1ك", "category": "خضروات", "price": 20, "unit": "كيلو", "barcode": "10036", "image": "https://images.unsplash.com/photo-1583687760622-95ea3f0c5d44?w=400", "description": "كوسة طازجة 1 كيلو", "rating": 4 },
    { "id": 117, "name": "بطاطس", "category": "خضروات", "price": 12, "unit": "كيلو", "barcode": "10039", "image": "https://images.unsplash.com/photo-1518977676405-d4f00bb5c0cd?w=400", "description": "بطاطس طازجة فاير", "rating": 4 },
    { "id": 118, "name": "بطاطس إسبونتا لوكس", "category": "خضروات", "price": 18, "unit": "قطعه", "barcode": "7973895988117", "image": "https://images.unsplash.com/photo-1518977676405-d4f00bb5c0cd?w=400", "description": "بطاطس إسبونتا لوكس", "rating": 5 },
    { "id": 119, "name": "قلقاس", "category": "خضروات", "price": 25, "unit": "كيلو", "barcode": "10042", "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", "description": "قلقاس طازج", "rating": 4 },
    { "id": 120, "name": "بطاطا لوكس", "category": "خضروات", "price": 15, "unit": "قطعه", "barcode": "7672597846700", "image": "https://images.unsplash.com/photo-1518977676405-d4f00bb5c0cd?w=400", "description": "بطاطا حلوة لوكس", "rating": 4 }
];

data.products = data.products.concat(products1);
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`Added ${products1.length} products.`);
