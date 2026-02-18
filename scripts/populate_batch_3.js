import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'full-products-data.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const products3 = [
    { "id": 225, "name": "رمان فاير", "category": "فواكه", "price": 50, "unit": "كيلو", "barcode": "10354", "image": "https://images.unsplash.com/photo-1601004890657-fa7de4e72c0d?w=400", "description": "رمان فاير حبات كبيرة", "rating": 5 },
    { "id": 226, "name": "رمان سبت", "category": "فواكه", "price": 250, "unit": "كيلو", "barcode": "10355", "image": "https://images.unsplash.com/photo-1601004890657-fa7de4e72c0d?w=400", "description": "رمان سبت حلو ممتاز", "rating": 5 },
    { "id": 227, "name": "فراولة", "category": "فواكه", "price": 40, "unit": "كيلو", "barcode": "10360", "image": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400", "description": "فراولة طازجة حمراء", "rating": 5 },
    { "id": 228, "name": "تفاح إيطالي أحمر", "category": "فواكه", "price": 90, "unit": "كيلو", "barcode": "10295", "image": "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400", "description": "تفاح إيطالي أحمر فاخر", "rating": 5 },
    { "id": 229, "name": "تفاح إيطالي جولدن", "category": "فواكه", "price": 85, "unit": "كيلو", "barcode": "10296", "image": "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400", "description": "تفاح إيطالي جولدن ذهبي", "rating": 5 },
    { "id": 230, "name": "تفاح سوري أحمر", "category": "فواكه", "price": 90, "unit": "كيلو", "barcode": "10281", "image": "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400", "description": "تفاح سوري أحمر فاخر", "rating": 5 },
    { "id": 231, "name": "تفاح سوري جولدن فاخر", "category": "فواكه", "price": 90, "unit": "كيلو", "barcode": "10283", "image": "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400", "description": "تفاح سوري جولدن فاخر", "rating": 5 },
    { "id": 232, "name": "مشمش بلدي", "category": "فواكه", "price": 0, "unit": "كيلو", "barcode": "10237", "image": "https://images.unsplash.com/photo-1501540193163-3c93af17c2da?w=400", "description": "مشمش بلدي حلو", "rating": 4 },
    { "id": 233, "name": "برقوق سنتروزة", "category": "فواكه", "price": 175, "unit": "كيلو", "barcode": "10253", "image": "https://images.unsplash.com/photo-1598679253544-2c97992403ea?w=400", "description": "برقوق سنتروزة إيطالي", "rating": 5 },
    { "id": 234, "name": "جوافة", "category": "فواكه", "price": 30, "unit": "كيلو", "barcode": "10271", "image": "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400", "description": "جوافة طازجة حلوة", "rating": 4 },
    { "id": 235, "name": "كمثرى بلدي لوكس", "category": "فواكه", "price": 75, "unit": "كيلو", "barcode": "10263", "image": "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=400", "description": "كمثرى بلدية فاخرة", "rating": 4 },
    { "id": 236, "name": "خوخ بلدي", "category": "فواكه", "price": 0, "unit": "كيلو", "barcode": "10177", "image": "https://images.unsplash.com/photo-1595475884562-073f22db6660?w=400", "description": "خوخ بلدي طازج", "rating": 4 },
    { "id": 237, "name": "ليتشي 200جم", "category": "فواكه", "price": 0, "unit": "قطعه", "barcode": "10236", "image": "https://images.unsplash.com/photo-1567922045116-2a00fae2ed03?w=400", "description": "ليتشي استوائي 200 جرام", "rating": 5 },
    { "id": 238, "name": "تين برشومي", "category": "فواكه", "price": 0, "unit": "كيلو", "barcode": "10362", "image": "https://images.unsplash.com/photo-1558908534-b2e2437cb659?w=400", "description": "تين برشومي حلو", "rating": 4 },
    { "id": 239, "name": "نبق", "category": "فواكه", "price": 70, "unit": "كيلو", "barcode": "10368", "image": "https://images.unsplash.com/photo-1601004890657-fa7de4e72c0d?w=400", "description": "نبق طازج", "rating": 4 },
    { "id": 240, "name": "قصب فريش متقشر", "category": "فواكه", "price": 35, "unit": "قطعه", "barcode": "2503962464920", "image": "https://images.unsplash.com/photo-1588613258815-8bdd68c22f0e?w=400", "description": "قصب سكر طازج متقشر", "rating": 4 },
    { "id": 301, "name": "تمر رطب سعودي 1ك", "category": "تمور", "price": 140, "unit": "قطعه", "barcode": "2627822765511", "image": "https://images.unsplash.com/photo-1573921470445-8d1a6f8d7d47?w=400", "description": "تمر رطب سعودي ملكي 1 كيلو", "rating": 5 },
    { "id": 302, "name": "تمر رطب سعودي 700جم", "category": "تمور", "price": 109, "unit": "كيلو", "barcode": "6417551590500", "image": "https://images.unsplash.com/photo-1573921470445-8d1a6f8d7d47?w=400", "description": "تمر رطب سعودي 700 جرام", "rating": 5 },
    { "id": 303, "name": "تمر عجوة المدينة 1ك", "category": "تمور", "price": 300, "unit": "قطعه", "barcode": "5178812498751", "image": "https://images.unsplash.com/photo-1573921470445-8d1a6f8d7d47?w=400", "description": "تمر عجوة المدينة السعودية 1 كيلو", "rating": 5 },
    { "id": 304, "name": "تمر مجدول سعودي", "category": "تمور", "price": 0, "unit": "قطعه", "barcode": "2471829641831", "image": "https://images.unsplash.com/photo-1573921470445-8d1a6f8d7d47?w=400", "description": "تمر مجدول سعودي فاخر", "rating": 5 },
    { "id": 305, "name": "تمر مفتل ملكي 1ك", "category": "تمور", "price": 200, "unit": "قطعه", "barcode": "3636486349622", "image": "https://images.unsplash.com/photo-1573921470445-8d1a6f8d7d47?w=400", "description": "تمر مفتل ملكي سعودي 1 كيلو", "rating": 5 },
    { "id": 306, "name": "تمر صقعي سعودي 1ك", "category": "تمور", "price": 230, "unit": "قطعه", "barcode": "9373267070545", "image": "https://images.unsplash.com/photo-1573921470445-8d1a6f8d7d47?w=400", "description": "تمر صقعي سعودي فاخر 1 كيلو", "rating": 5 },
    { "id": 307, "name": "تمر عراقي 10ك", "category": "تمور", "price": 600, "unit": "قطعه", "barcode": "3947338712984", "image": "https://images.unsplash.com/photo-1573921470445-8d1a6f8d7d47?w=400", "description": "تمر عراقي فاخر 10 كيلو", "rating": 5 },
    { "id": 308, "name": "تمر صفاوي سعودي 1ك", "category": "تمور", "price": 400, "unit": "قطعه", "barcode": "5099595983763", "image": "https://images.unsplash.com/photo-1573921470445-8d1a6f8d7d47?w=400", "description": "تمر صفاوي المدينة 1 كيلو", "rating": 5 },
    { "id": 309, "name": "تمر مجدول جامبو جنيا 1ك", "category": "تمور", "price": 395, "unit": "قطعه", "barcode": "1451162916460", "image": "https://images.unsplash.com/photo-1573921470445-8d1a6f8d7d47?w=400", "description": "تمر مجدول جامبو فاخر 1 كيلو", "rating": 5 },
    { "id": 310, "name": "تمر يمني 1ك", "category": "تمور", "price": 80, "unit": "قطعه", "barcode": "4168107517619", "image": "https://images.unsplash.com/photo-1573921470445-8d1a6f8d7d47?w=400", "description": "تمر يمني طبيعي 1 كيلو", "rating": 4 },
    { "id": 311, "name": "رطب قصيم سعودي 350جم", "category": "تمور", "price": 500, "unit": "قطعه", "barcode": "9728415633248", "image": "https://images.unsplash.com/photo-1573921470445-8d1a6f8d7d47?w=400", "description": "رطب قصيم سعودي فاخر 350 جرام", "rating": 5 },
    { "id": 312, "name": "تمر رطب ملكي جنيا 1ك", "category": "تمور", "price": 195, "unit": "قطعه", "barcode": "", "image": "https://images.unsplash.com/photo-1573921470445-8d1a6f8d7d47?w=400", "description": "تمر رطب ملكي جنيا 1 كيلو", "rating": 5 },
    { "id": 401, "name": "عسل حبة البركة 1000مل", "category": "زيوت & عسل", "price": 130, "unit": "قطعه", "barcode": "7865105464002", "image": "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400", "description": "عسل حبة البركة الطبيعي 1000مل", "rating": 5 },
    { "id": 402, "name": "عسل السدر 1000مل", "category": "زيوت & عسل", "price": 0, "unit": "قطعه", "barcode": "3088729342011", "image": "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400", "description": "عسل السدر الطبيعي 1000مل", "rating": 5 },
    { "id": 403, "name": "عسل زهرة البرسيم 1000مل", "category": "زيوت & عسل", "price": 0, "unit": "قطعه", "barcode": "6418722067760", "image": "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400", "description": "عسل زهرة البرسيم الطبيعي 1000مل", "rating": 5 },
    { "id": 404, "name": "عسل سدر جبلي بيكو 350جم", "category": "زيوت & عسل", "price": 210, "unit": "قطعه", "barcode": "6223001530213", "image": "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400", "description": "عسل سدر جبلي بيكو 350 جرام", "rating": 5 },
    { "id": 405, "name": "عسل نوارة البرسيم بيكو 350جم", "category": "زيوت & عسل", "price": 90, "unit": "قطعه", "barcode": "6223001532262", "image": "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400", "description": "عسل نوارة البرسيم بيكو 350 جرام", "rating": 4 },
    { "id": 406, "name": "مربي فراولة بيكو 340جم", "category": "زيوت & عسل", "price": 120, "unit": "قطعه", "barcode": "6223001531647", "image": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400", "description": "مربي فراولة بيكو 340 جرام", "rating": 5 },
    { "id": 407, "name": "مربي بلو بيري بيكو 340جم", "category": "زيوت & عسل", "price": 120, "unit": "قطعه", "barcode": "4344848632549", "image": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400", "description": "مربي بلو بيري بيكو 340 جرام", "rating": 5 },
    { "id": 408, "name": "زيت زيتون جنيا 250مل بكر ممتاز", "category": "زيوت & عسل", "price": 160, "unit": "قطعه", "barcode": "", "image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400", "description": "زيت زيتون جنيا بكر ممتاز 250مل", "rating": 5 },
    { "id": 409, "name": "زيت زيتون جنيا 500مل بكر ممتاز", "category": "زيوت & عسل", "price": 330, "unit": "قطعه", "barcode": "", "image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400", "description": "زيت زيتون جنيا بكر ممتاز 500مل", "rating": 5 },
    { "id": 410, "name": "سمن بلدي جاموسي", "category": "زيوت & عسل", "price": 380, "unit": "قطعه", "barcode": "2121917901650", "image": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400", "description": "سمن بلدي جاموسي فلاحي 900 جرام", "rating": 5 },
    { "id": 501, "name": "خس كابوتشا كبير", "category": "ورقيات", "price": 12, "unit": "قطعه", "barcode": "2117104747323", "image": "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400", "description": "خس كابوتشا كبير طازج", "rating": 5 },
    { "id": 502, "name": "خس بلدي", "category": "ورقيات", "price": 7, "unit": "قطعه", "barcode": "2124693722020", "image": "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400", "description": "خس بلدي طازج", "rating": 4 },
    { "id": 503, "name": "كرنب أبيض", "category": "ورقيات", "price": 15, "unit": "قطعه", "barcode": "2874003473851", "image": "https://images.unsplash.com/photo-1544218222-1c4a2be3b00a?w=400", "description": "كرنب أبيض طازج", "rating": 4 }
];

data.products = data.products.concat(products3);
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`Added ${products3.length} products.`);
