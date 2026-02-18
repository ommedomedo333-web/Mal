import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'full-products-data.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const products4 = [
    { "id": 504, "name": "كرنب أحمر", "category": "ورقيات", "price": 12, "unit": "قطعه", "barcode": "3169079893764", "image": "https://images.unsplash.com/photo-1544218222-1c4a2be3b00a?w=400", "description": "كرنب أحمر طازج", "rating": 4 },
    { "id": 505, "name": "كرنب محشي", "category": "ورقيات", "price": 25, "unit": "قطعه", "barcode": "3342636611234", "image": "https://images.unsplash.com/photo-1544218222-1c4a2be3b00a?w=400", "description": "كرنب للمحشي", "rating": 5 },
    { "id": 506, "name": "بروكلي", "category": "ورقيات", "price": 35, "unit": "قطعه", "barcode": "10096", "image": "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400", "description": "بروكلي أخضر طازج", "rating": 5 },
    { "id": 507, "name": "خرشوف", "category": "ورقيات", "price": 0, "unit": "قطعه", "barcode": "4015102594629", "image": "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400", "description": "خرشوف طازج", "rating": 4 },
    { "id": 508, "name": "نعناع", "category": "ورقيات", "price": 5, "unit": "قطعه", "barcode": "9894096704444", "image": "https://images.unsplash.com/photo-1628684657034-7ecb87bc2e4e?w=400", "description": "نعناع طازج", "rating": 4 },
    { "id": 509, "name": "خضرة", "category": "ورقيات", "price": 2.5, "unit": "فرزة", "barcode": "2817486069401", "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", "description": "خضرة طازجة مشكل", "rating": 5 },
    { "id": 510, "name": "كرفس", "category": "ورقيات", "price": 50, "unit": "قطعه", "barcode": "9119795221499", "image": "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400", "description": "كرفس طازج", "rating": 4 },
    { "id": 511, "name": "بقدونس", "category": "ورقيات", "price": 5, "unit": "قطعه", "barcode": "8595204563205", "image": "https://images.unsplash.com/photo-1628684657034-7ecb87bc2e4e?w=400", "description": "بقدونس طازج", "rating": 4 },
    { "id": 512, "name": "ريحان", "category": "ورقيات", "price": 25, "unit": "قطعه", "barcode": "5536477760390", "image": "https://images.unsplash.com/photo-1628684657034-7ecb87bc2e4e?w=400", "description": "ريحان طازج", "rating": 4 },
    { "id": 513, "name": "روزماري طبق", "category": "ورقيات", "price": 10, "unit": "قطعه", "barcode": "8468248862095", "image": "https://images.unsplash.com/photo-1628684657034-7ecb87bc2e4e?w=400", "description": "روزماري طازج في طبق", "rating": 4 },
    { "id": 514, "name": "طبق ورق عنب لوكس 500جم", "category": "ورقيات", "price": 0, "unit": "طبق", "barcode": "5005556407940", "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", "description": "ورق عنب لوكس 500 جرام", "rating": 5 },
    { "id": 601, "name": "ملوخية خضراء مخروطة", "category": "مجمدات", "price": 100, "unit": "طبق", "barcode": "6223000370223", "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", "description": "ملوخية خضراء مجمدة مخروطة", "rating": 5 },
    { "id": 602, "name": "بسلة مجمدة 400جم النعيم", "category": "مجمدات", "price": 39, "unit": "قطعه", "barcode": "6225000507890", "image": "https://images.unsplash.com/photo-1567254790339-70da37a60f27?w=400", "description": "بسلة ساده مجمدة 400جم النعيم", "rating": 4 },
    { "id": 603, "name": "باميه زيرو مجمدة 400جم النعيم", "category": "مجمدات", "price": 42, "unit": "قطعه", "barcode": "6225000507845", "image": "https://images.unsplash.com/photo-1567254790339-70da37a60f27?w=400", "description": "باميه زيرو مجمدة 400جم النعيم", "rating": 4 },
    { "id": 604, "name": "خضار مشكل مجمدة 400جم", "category": "مجمدات", "price": 24, "unit": "قطعه", "barcode": "6225000507838", "image": "https://images.unsplash.com/photo-1567254790339-70da37a60f27?w=400", "description": "خضار مشكل مجمدة للشوربة", "rating": 4 },
    { "id": 605, "name": "فراولة مجمدة 400جم النعيم", "category": "مجمدات", "price": 44, "unit": "قطعه", "barcode": "6225000507883", "image": "https://images.unsplash.com/photo-1567254790339-70da37a60f27?w=400", "description": "فراولة مجمدة 400جم النعيم", "rating": 4 },
    { "id": 606, "name": "رمان مجمد 400جم النعيم", "category": "مجمدات", "price": 41, "unit": "قطعه", "barcode": "6225000507876", "image": "https://images.unsplash.com/photo-1567254790339-70da37a60f27?w=400", "description": "رمان مجمد 400جم النعيم", "rating": 4 },
    { "id": 607, "name": "مانجو مجمدة 400جم النعيم", "category": "مجمدات", "price": 54, "unit": "قطعه", "barcode": "6224002976093", "image": "https://images.unsplash.com/photo-1567254790339-70da37a60f27?w=400", "description": "مانجو مجمدة 400جم النعيم", "rating": 5 },
    { "id": 608, "name": "ملوخية النعيم 400جم", "category": "مجمدات", "price": 20, "unit": "قطعه", "barcode": "6225000507814", "image": "https://images.unsplash.com/photo-1567254790339-70da37a60f27?w=400", "description": "ملوخية مجمدة النعيم 400 جرام", "rating": 4 },
    { "id": 609, "name": "باميه ممتازة بسمة 400جم", "category": "مجمدات", "price": 32, "unit": "طبق", "barcode": "6223000371022", "image": "https://images.unsplash.com/photo-1567254790339-70da37a60f27?w=400", "description": "باميه ممتازة مجمدة بسمة 400جم", "rating": 4 },
    { "id": 610, "name": "فراولة مجمدة 800جم أجا", "category": "مجمدات", "price": 85, "unit": "قطعه", "barcode": "6221055003400", "image": "https://images.unsplash.com/photo-1567254790339-70da37a60f27?w=400", "description": "فراولة مجمدة 800جم أجا", "rating": 5 },
    { "id": 701, "name": "كوب زبادي الأديب", "category": "البان", "price": 12, "unit": "قطعه", "barcode": "6224000850999", "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400", "description": "كوب زبادي بلدي الأديب", "rating": 5 },
    { "id": 702, "name": "جبنة قريش 1ك الأديب", "category": "البان", "price": 55, "unit": "عبوة", "barcode": "6224000850500", "image": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400", "description": "جبنة قريش تحابيش 1 كيلو الأديب", "rating": 5 },
    { "id": 703, "name": "جبنة كيري 450جم الأديب", "category": "البان", "price": 45, "unit": "عبوة", "barcode": "6766427212849", "image": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400", "description": "جبنة كيري 450جم الأديب", "rating": 4 },
    { "id": 704, "name": "قشطة بلدي 200جم الأديب", "category": "البان", "price": 45, "unit": "عبوة", "barcode": "6224000850685", "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400", "description": "قشطة بلدي 200جم الأديب", "rating": 5 },
    { "id": 705, "name": "سبريد رومي 450جم الأديب", "category": "البان", "price": 40, "unit": "عبوة", "barcode": "3719589897211", "image": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400", "description": "جبنة سبريد رومي 450جم الأديب", "rating": 4 },
    { "id": 706, "name": "مورتة 1ك الأديب", "category": "البان", "price": 75, "unit": "قطعه", "barcode": "6224000850630", "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400", "description": "مورتة زبادي 1 كيلو الأديب", "rating": 5 },
    { "id": 801, "name": "عصير مانجو بوكا", "category": "عصير", "price": 0, "unit": "قطعه", "barcode": "2112722929199", "image": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400", "description": "عصير مانجو بوكا طازج", "rating": 4 },
    { "id": 802, "name": "عصير برقوق", "category": "عصير", "price": 350, "unit": "قطعه", "barcode": "5809919622007", "image": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400", "description": "عصير برقوق طبيعي", "rating": 4 },
    { "id": 803, "name": "عصير مانجو زين 1لتر", "category": "عصير", "price": 0, "unit": "قطعه", "barcode": "6696289883157", "image": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400", "description": "عصير مانجو زين 1 لتر", "rating": 4 },
    { "id": 804, "name": "عصير مانجو زين 2لتر", "category": "عصير", "price": 0, "unit": "قطعه", "barcode": "6780234266031", "image": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400", "description": "عصير مانجو زين 2 لتر", "rating": 4 },
    { "id": 805, "name": "عصير كيوي زين 1لتر", "category": "عصير", "price": 0, "unit": "قطعه", "barcode": "5880944054285", "image": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400", "description": "عصير كيوي زين 1 لتر", "rating": 4 },
    { "id": 901, "name": "كيس سكر 950جم", "category": "اخرى", "price": 30, "unit": "قطعه", "barcode": "7552745780752", "image": "https://images.unsplash.com/photo-1559181567-c3190bea4b84?w=400", "description": "كيس سكر ناعم 950 جرام", "rating": 4 },
    { "id": 902, "name": "كرتونة بيض أحمر", "category": "اخرى", "price": 0, "unit": "طبق", "barcode": "5834419107273", "image": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400", "description": "كرتونة بيض أحمر طازج", "rating": 4 },
    { "id": 903, "name": "كرتونة بيض بلدي", "category": "اخرى", "price": 0, "unit": "طبق", "barcode": "7854366316007", "image": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400", "description": "كرتونة بيض بلدي طازج", "rating": 5 },
    { "id": 904, "name": "أرز أبيض رفيع 5ك", "category": "اخرى", "price": 125, "unit": "قطعه", "barcode": "2831503499514", "image": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400", "description": "أرز أبيض رفيع 5 كيلو", "rating": 4 },
    { "id": 905, "name": "أرز أبيض رفيع 10ك", "category": "اخرى", "price": 250, "unit": "قطعه", "barcode": "5141016853244", "image": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400", "description": "أرز أبيض رفيع 10 كيلو", "rating": 4 },
    { "id": 1001, "name": "فواكه مجففة دراجون فروت 50جم", "category": "فواكه مجففه", "price": 250, "unit": "قطعه", "barcode": "", "image": "https://images.unsplash.com/photo-1559181567-c3190bea4b84?w=400", "description": "دراجون فروت مجفف 50 جرام", "rating": 5 },
    { "id": 1002, "name": "فواكه مجففة مانجو 50جم", "category": "فواكه مجففه", "price": 250, "unit": "قطعه", "barcode": "", "image": "https://images.unsplash.com/photo-1559181567-c3190bea4b84?w=400", "description": "مانجو مجففة 50 جرام", "rating": 5 },
    { "id": 1003, "name": "فواكه مجففة فراولة 50جم", "category": "فواكه مجففه", "price": 250, "unit": "قطعه", "barcode": "", "image": "https://images.unsplash.com/photo-1559181567-c3190bea4b84?w=400", "description": "فراولة مجففة 50 جرام", "rating": 5 },
    { "id": 1004, "name": "فواكه مجففة كيوي 50جم", "category": "فواكه مجففه", "price": 250, "unit": "قطعه", "barcode": "", "image": "https://images.unsplash.com/photo-1559181567-c3190bea4b84?w=400", "description": "كيوي مجففة 50 جرام", "rating": 5 },
    { "id": 1005, "name": "فواكه مجففة مشكل 100جم", "category": "فواكه مجففه", "price": 480, "unit": "قطعه", "barcode": "", "image": "https://images.unsplash.com/photo-1559181567-c3190bea4b84?w=400", "description": "مشكل فواكه مجففة 100 جرام", "rating": 5 },
    { "id": 1006, "name": "خضروات مجففة مشكل 180جم", "category": "فواكه مجففه", "price": 210, "unit": "قطعه", "barcode": "", "image": "https://images.unsplash.com/photo-1559181567-c3190bea4b84?w=400", "description": "خضروات مجففة مشكل سادة 180 جرام", "rating": 4 },
    { "id": 1101, "name": "كوب بستان الفواكه", "category": "فريش", "price": 0, "unit": "قطعه", "barcode": "7141143099681", "image": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400", "description": "كوب بستان الفواكه الطازجة", "rating": 5 },
    { "id": 1102, "name": "شهد فانيليا", "category": "فريش", "price": 35, "unit": "قطعه", "barcode": "5839791524403", "image": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", "description": "شهد فانيليا فريش", "rating": 5 }
];

data.products = data.products.concat(products4);
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`Added ${products4.length} products.`);
