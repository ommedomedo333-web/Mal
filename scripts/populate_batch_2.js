import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'full-products-data.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const products2 = [
    { "id": 121, "name": "بصل أحمر", "category": "خضروات", "price": 12, "unit": "كيلو", "barcode": "10047", "image": "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=400", "description": "بصل أحمر فاير طازج", "rating": 4 },
    { "id": 122, "name": "بصل أبيض", "category": "خضروات", "price": 15, "unit": "كيلو", "barcode": "10050", "image": "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=400", "description": "بصل أبيض فاير طازج", "rating": 4 },
    { "id": 123, "name": "ثوم بلدي", "category": "خضروات", "price": 0, "unit": "كيلو", "barcode": "10056", "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400", "description": "ثوم بلدي أبيض طازج", "rating": 4 },
    { "id": 124, "name": "ثوم صيني", "category": "خضروات", "price": 20, "unit": "كيس", "barcode": "6943128000085", "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400", "description": "ثوم صيني ملفوف", "rating": 4 },
    { "id": 125, "name": "جزر لوكس", "category": "خضروات", "price": 15, "unit": "قطعه", "barcode": "2565682998451", "image": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400", "description": "جزر لوكس طازج", "rating": 5 },
    { "id": 126, "name": "جزر - طبق 1ك", "category": "خضروات", "price": 20, "unit": "قطعه", "barcode": "7584622858759", "image": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400", "description": "طبق جزر لوكس 1 كيلو", "rating": 5 },
    { "id": 127, "name": "ليمون بلدي", "category": "خضروات", "price": 25, "unit": "كيلو", "barcode": "10064", "image": "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400", "description": "ليمون بلدي طازج", "rating": 4 },
    { "id": 128, "name": "ليمون بلدي لوكس", "category": "خضروات", "price": 20, "unit": "قطعه", "barcode": "4353942745024", "image": "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400", "description": "ليمون بلدي لوكس", "rating": 5 },
    { "id": 129, "name": "مشروم", "category": "خضروات", "price": 200, "unit": "قطعه", "barcode": "9617535560889", "image": "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=400", "description": "مشروم فريش طازج", "rating": 5 },
    { "id": 130, "name": "برطمان مشروم فريش", "category": "خضروات", "price": 100, "unit": "قطعه", "barcode": "7286786661540", "image": "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=400", "description": "مشروم فريش في برطمان", "rating": 5 },
    { "id": 131, "name": "زنجبيل فريش", "category": "خضروات", "price": 220, "unit": "كيلو", "barcode": "10086", "image": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400", "description": "زنجبيل فريش طازج", "rating": 5 },
    { "id": 132, "name": "شطة لوكس أحمر", "category": "خضروات", "price": 30, "unit": "كيلو", "barcode": "5420061565150", "image": "https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?w=400", "description": "شطة حمراء لوكس حارة", "rating": 4 },
    { "id": 133, "name": "ذرة سكري", "category": "خضروات", "price": 65, "unit": "كيس", "barcode": "6223001530299", "image": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400", "description": "ذرة سكري فريش فاكيوم بيكو", "rating": 5 },
    { "id": 134, "name": "مشروم موفريش طبق", "category": "خضروات", "price": 35, "unit": "قطعه", "barcode": "4260004102506", "image": "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=400", "description": "مشروم فريش في طبق", "rating": 5 },
    { "id": 135, "name": "بنجر", "category": "خضروات", "price": 15, "unit": "كيلو", "barcode": "10084", "image": "https://images.unsplash.com/photo-1593280405106-e438ebe93f5f?w=400", "description": "بنجر أحمر طازج", "rating": 4 },
    { "id": 136, "name": "كوز ذرة", "category": "خضروات", "price": 10, "unit": "قطعه", "barcode": "", "image": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400", "description": "كوز ذرة طازج", "rating": 4 },
    { "id": 137, "name": "فاصوليا خضراء", "category": "خضروات", "price": 45, "unit": "كيلو", "barcode": "", "image": "https://images.unsplash.com/photo-1567748157439-651aca2ff064?w=400", "description": "فاصوليا خضراء طازجة", "rating": 4 },
    { "id": 201, "name": "مانجو كيت", "category": "فواكه", "price": 100, "unit": "كيلو", "barcode": "10128", "image": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400", "description": "مانجو كيت الشهيرة", "rating": 5 },
    { "id": 202, "name": "مانجو عويس", "category": "فواكه", "price": 0, "unit": "كيلو", "barcode": "10101", "image": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400", "description": "مانجو عويس الأصيلة", "rating": 5 },
    { "id": 203, "name": "مانجو سكري", "category": "فواكه", "price": 0, "unit": "كيلو", "barcode": "10108", "image": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400", "description": "مانجو سكري حلوة", "rating": 5 },
    { "id": 204, "name": "موز بلدي", "category": "فواكه", "price": 25, "unit": "كيلو", "barcode": "10349", "image": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400", "description": "موز بلدي طازج", "rating": 4 },
    { "id": 205, "name": "موز بلدي لوكس", "category": "فواكه", "price": 30, "unit": "كيلو", "barcode": "8539232107123", "image": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400", "description": "موز بلدي لوكس مختار", "rating": 5 },
    { "id": 206, "name": "موز مستورد", "category": "فواكه", "price": 80, "unit": "كيلو", "barcode": "10351", "image": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400", "description": "موز مستورد فاخر", "rating": 5 },
    { "id": 207, "name": "عنب أحمر", "category": "فواكه", "price": 50, "unit": "كيلو", "barcode": "10144", "image": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400", "description": "عنب أحمر طازج", "rating": 4 },
    { "id": 208, "name": "عنب أسود", "category": "فواكه", "price": 150, "unit": "كيلو", "barcode": "10145", "image": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400", "description": "عنب أسود فاخر", "rating": 5 },
    { "id": 209, "name": "عنب كرمسون", "category": "فواكه", "price": 0, "unit": "كيلو", "barcode": "10146", "image": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400", "description": "عنب كرمسون المميز", "rating": 5 },
    { "id": 210, "name": "برتقال بصرة", "category": "فواكه", "price": 20, "unit": "كيلو", "barcode": "10165", "image": "https://images.unsplash.com/photo-1548155949-e3a8d09ad8ad?w=400", "description": "برتقال بصرة عصيري", "rating": 4 },
    { "id": 211, "name": "برتقال سكري", "category": "فواكه", "price": 20, "unit": "كيلو", "barcode": "10160", "image": "https://images.unsplash.com/photo-1548155949-e3a8d09ad8ad?w=400", "description": "برتقال سكري حلو", "rating": 5 },
    { "id": 212, "name": "يوسفي بلدي", "category": "فواكه", "price": 25, "unit": "كيلو", "barcode": "10169", "image": "https://images.unsplash.com/photo-1587855049254-351f4e55fe2a?w=400", "description": "يوسفي بلدي طازج", "rating": 4 },
    { "id": 213, "name": "كيوي فاخر", "category": "فواكه", "price": 150, "unit": "كيلو", "barcode": "10212", "image": "https://images.unsplash.com/photo-1618897996318-5a901fa696ca?w=400", "description": "كيوي فاخر طازج", "rating": 5 },
    { "id": 214, "name": "كيوي رفيع", "category": "فواكه", "price": 90, "unit": "كيلو", "barcode": "10214", "image": "https://images.unsplash.com/photo-1618897996318-5a901fa696ca?w=400", "description": "كيوي رفيع ممتاز", "rating": 4 },
    { "id": 215, "name": "أفوكادو", "category": "فواكه", "price": 180, "unit": "كيلو", "barcode": "10224", "image": "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=400", "description": "أفوكادو طازج", "rating": 5 },
    { "id": 216, "name": "دراجون فروت أحمر", "category": "فواكه", "price": 400, "unit": "كيلو", "barcode": "10234", "image": "https://images.unsplash.com/photo-1527325678964-54921661f888?w=400", "description": "دراجون فروت أحمر استوائي", "rating": 5 },
    { "id": 217, "name": "باشون فروت", "category": "فواكه", "price": 180, "unit": "قطعه", "barcode": "8122503615276", "image": "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400", "description": "باشون فروت استوائي", "rating": 5 },
    { "id": 218, "name": "مانجوستين", "category": "فواكه", "price": 270, "unit": "قطعه", "barcode": "9067777477191", "image": "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400", "description": "مانجوستين استوائي 175جم", "rating": 5 },
    { "id": 219, "name": "جوز هند", "category": "فواكه", "price": 70, "unit": "قطعه", "barcode": "8544309189155", "image": "https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?w=400", "description": "جوز هند طازج", "rating": 4 },
    { "id": 220, "name": "أناناس", "category": "فواكه", "price": 250, "unit": "قطعه", "barcode": "9429241435272", "image": "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400", "description": "أناناس كبير شجري", "rating": 5 },
    { "id": 221, "name": "بطيخ أحمر", "category": "فواكه", "price": 160, "unit": "قطعه", "barcode": "8074554483802", "image": "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400", "description": "بطيخ أحمر حلو طازج", "rating": 5 },
    { "id": 222, "name": "شمام", "category": "فواكه", "price": 0, "unit": "كيلو", "barcode": "10343", "image": "https://images.unsplash.com/photo-1571805529673-0f56b922b359?w=400", "description": "شمام عسلي حلو", "rating": 4 },
    { "id": 223, "name": "قشطة", "category": "فواكه", "price": 220, "unit": "كيلو", "barcode": "10334", "image": "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400", "description": "قشطة طازجة حلوة", "rating": 5 },
    { "id": 224, "name": "كنتالوب", "category": "فواكه", "price": 25, "unit": "كيلو", "barcode": "10336", "image": "https://images.unsplash.com/photo-1571805529673-0f56b922b359?w=400", "description": "كنتالوب بلوا طازج", "rating": 4 }
];

data.products = data.products.concat(products2);
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`Added ${products2.length} products.`);
