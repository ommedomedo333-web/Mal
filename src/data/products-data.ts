
export const LABEL_STYLES = {
  "فريش":        { bg: "#16a34a", text: "#fff", icon: "🌱" },
  "مستورد":       { bg: "#2563eb", text: "#fff", icon: "✈️" },
  "كمية محدودة": { bg: "#dc2626", text: "#fff", icon: "⚡" },
  "عرض خاص":     { bg: "#d97706", text: "#fff", icon: "🔥" },
  "عضوي":        { bg: "#059669", text: "#fff", icon: "♻️" },
  "موسمي":        { bg: "#7c3aed", text: "#fff", icon: "🍂" },
  "جديد":        { bg: "#0891b2", text: "#fff", icon: "✨" },
};

export const categories = [
  {
    id: "vegetables", name: "خضروات", nameEn: "Vegetables", emoji: "🥦",
    color: "#15803d", accent: "#4ade80", dark: "#052e16",
    image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&q=80",
    description: "أطازج الخضروات المحلية والمستوردة، مختارة بعناية لضمان أعلى جودة ومذاق رائع.",
    items: [
      { id:1, name:"طماطم بلدي",  unit:"كيلو",  price:8,   label:"فريش",        desc:"طماطم طازجة من المزرعة مباشرة", image:"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&q=80", note:"يومي" },
      { id:2, name:"خيار",        unit:"كيلو",  price:6,   label:"فريش",        desc:"خيار أخضر طازج مقرمش", image:"https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=300&q=80", note:"" },
      { id:3, name:"فلفل ألوان",  unit:"كيلو",  price:18,  label:"مستورد",      desc:"فلفل ملون غني بفيتامين C", image:"https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&q=80", note:"هولندي" },
      { id:4, name:"بروكلي",      unit:"رأس",   price:12,  label:"مستورد",      desc:"بروكلي طازج كامل الرأس", image:"https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300&q=80", note:"" },
      { id:5, name:"جزر عضوي",    unit:"كيلو",  price:10,  label:"عضوي",        desc:"جزر بدون مبيدات غني بالكاروتين", image:"https://images.unsplash.com/photo-1447175008436-054170c2e979?w=300&q=80", note:"شهادة عضوي" },
    ],
  },
  {
    id: "greens", name: "ورقيات وأعشاب", nameEn: "Greens & Herbs", emoji: "🌿",
    color: "#166534", accent: "#86efac", dark: "#052e16",
    image: "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=600&q=80",
    description: "أعشاب طازجة وورقيات خضراء من أفضل المصادر لصحتك.",
    items: [
      { id:1, name:"نعناع طازج",   unit:"ربطة", price:3,  label:"فريش",   desc:"نعناع منعش لعصائرك", image:"https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=300&q=80", note:"يومي" },
      { id:2, name:"كزبرة",        unit:"ربطة", price:2,  label:"فريش",   desc:"لا غنى عنها في الطبخ العربي", image:"https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=300&q=80", note:"" },
      { id:3, name:"سبانخ بيبي",   unit:"كيس",  price:15, label:"مستورد", desc:"جاهزة للأكل مباشرة", image:"https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80", note:"جاهز" },
      { id:4, name:"ريحان إيطالي", unit:"ربطة", price:8,  label:"مستورد", desc:"أساس صوص البيستو الإيطالي", image:"https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=300&q=80", note:"إيطالي" },
    ],
  },
  {
    id: "fruits", name: "فواكه", nameEn: "Fruits", emoji: "🍊",
    color: "#c2410c", accent: "#fb923c", dark: "#431407",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&q=80",
    description: "تشكيلة واسعة من الفواكه الطازجة الموسمية والمستوردة.",
    items: [
      { id:1, name:"تفاح أحمر",   unit:"كيلو", price:22, label:"مستورد",      desc:"حلو ومقرمش أمريكي", image:"https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&q=80", note:"أمريكي" },
      { id:2, name:"برتقال بلدي", unit:"كيلو", price:10, label:"موسمي",       desc:"برتقال مصري حلو موسمي", image:"https://images.unsplash.com/photo-1547514701-42782101795e?w=300&q=80", note:"شتوي" },
      { id:3, name:"مانجو فاقس",  unit:"كيلو", price:35, label:"كمية محدودة", desc:"أشهر مانجو مصرية", image:"https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=300&q=80", note:"موسم محدود" },
      { id:4, name:"فراولة",      unit:"كيلو", price:28, label:"فريش",        desc:"طازجة يومياً", image:"https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&q=80", note:"يومي" },
      { id:5, name:"عنب بدون بذور",unit:"كيلو",price:40, label:"عرض خاص",    desc:"حبات كبيرة مستوردة", image:"https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=300&q=80", note:"بدون بذور" },
    ],
  },
  {
    id: "dates", name: "تمور", nameEn: "Dates", emoji: "🫘",
    color: "#92400e", accent: "#fbbf24", dark: "#451a03",
    image: "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=600&q=80",
    description: "أجود أنواع التمور من السعودية والإمارات والعراق.",
    items: [
      { id:1, name:"مجدول سعودي",  unit:"كيلو", price:120, label:"مستورد",     desc:"ملك التمور من المدينة المنورة", image:"https://images.unsplash.com/photo-1576181256399-834e3b3a49bf?w=300&q=80", note:"المدينة المنورة" },
      { id:2, name:"خلاص إماراتي",unit:"كيلو", price:90,  label:"مستورد",     desc:"تمر ذهبي بحلاوة استثنائية", image:"https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?w=300&q=80", note:"إماراتي" },
      { id:3, name:"سكري",         unit:"كيلو", price:75,  label:"عرض خاص",   desc:"التمر الأصفر الشهير", image:"https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=300&q=80", note:"هذا الأسبوع" },
    ],
  },
  {
    id: "honey", name: "عسل", nameEn: "Honey", emoji: "🍯",
    color: "#b45309", accent: "#fcd34d", dark: "#451a03",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
    description: "عسل طبيعي خام من أجود المناحل في اليمن والجبال.",
    items: [
      { id:1, name:"سدر يمني",    unit:"كيلو",  price:800, label:"كمية محدودة", desc:"ملك العسل من وادي دوعن", image:"https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300&q=80", note:"وادي دوعن" },
      { id:2, name:"أعشاب جبلي", unit:"كيلو",  price:350, label:"جديد",        desc:"من مناطق جبلية نقية", image:"https.unsplash.com/photo-1587049352846-4a222e784d38?w=300&q=80", note:"نقي 100%" },
      { id:3, name:"مانوكا",      unit:"250جم", price:450, label:"مستورد",      desc:"خصائص علاجية فريدة", image:"https://images.unsplash.com/photo-1550411294-e9884b159428?w=300&q=80", note:"نيوزيلندي" },
    ],
  },
  {
    id: "nuts", name: "مكسرات & ياميش", nameEn: "Nuts & Dried Fruits", emoji: "🥜",
    color: "#7c2d12", accent: "#d97706", dark: "#1c0701",
    image: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=600&q=80",
    description: "مكسرات فاخرة وياميش متنوع من أفضل المصادر.",
    items: [
      { id:1, name:"لوز إيراني",  unit:"كيلو", price:85,  label:"مستورد",     desc:"محمص طازج غني بالبروتين", image:"https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=300&q=80", note:"إيراني" },
      { id:2, name:"كاجو هندي",   unit:"كيلو", price:120, label:"مستورد",     desc:"كامل الحبة كريمي", image:"https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=300&q=80", note:"W240" },
      { id:3, name:"فستق حلبي",   unit:"كيلو", price:200, label:"كمية محدودة",desc:"سوري أصيل الأجود عالمياً", image:"https://images.unsplash.com/photo-1616684000067-36952fde56ec?w=300&q=80", note:"سوري" },
      { id:4, name:"زبيب أخضر",   unit:"كيلو", price:55,  label:"عرض خاص",   desc:"كابولي حلو بدون إضافات", image:"https://images.unsplash.com/photo-1596591868231-05e808fd131d?w=300&q=80", note:"كابول" },
    ],
  },
  {
    id: "preparations", name: "تجهيزات", nameEn: "Preparations", emoji: "🥗",
    color: "#166534", accent: "#a3e635", dark: "#052e16",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    description: "وجبات وسلطات مجهزة طازجة يومياً جاهزة للتقديم.",
    items: [
      { id:1, name:"سلطة فتوش", unit:"علبة", price:25, label:"فريش", desc:"فتوش يومي بالخضار الطازج", image:"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80", note:"يومي" },
      { id:2, name:"تبولة",     unit:"علبة", price:22, label:"فريش", desc:"لبنانية بالبرغل والبقدونس", image:"https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&q=80", note:"لبناني" },
      { id:3, name:"خضار مقطع",unit:"كيس",  price:30, label:"فريش", desc:"جاهز للطهي مباشرة", image:"https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=300&q=80", note:"جاهز" },
    ],
  },
  {
    id: "juices", name: "عصاير", nameEn: "Juices", emoji: "🥤",
    color: "#b45309", accent: "#fbbf24", dark: "#451a03",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80",
    description: "عصاير طبيعية معصورة يومياً بدون إضافات أو حافظات.",
    items: [
      { id:1, name:"برتقال طازج", unit:"لتر",  price:35, label:"فريش",        desc:"معصور لحظياً بدون سكر", image:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&q=80", note:"لحظي" },
      { id:2, name:"عصير قصب",   unit:"كوب",  price:15, label:"فريش",        desc:"معصور مباشر منعش", image:"https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=300&q=80", note:"مباشر" },
      { id:3, name:"رمان طازج",  unit:"لتر",  price:65, label:"كمية محدودة", desc:"غني بمضادات الأكسدة", image:"https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&q=80", note:"موسمي" },
      { id:4, name:"جزر زنجبيل", unit:"لتر",  price:45, label:"جديد",        desc:"شوت صحي مقوي للمناعة", image:"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80", note:"شوت صحي" },
    ],
  },
  {
    id: "frozen", name: "مجمدات", nameEn: "Frozen", emoji: "❄️",
    color: "#1d4ed8", accent: "#60a5fa", dark: "#172554",
    image: "https://images.unsplash.com/photo-1498654200943-1088dd4438ae?w=600&q=80",
    description: "منتجات مجمدة بأحدث تقنيات الحفظ مع الحفاظ على القيمة الغذائية.",
    items: [
      { id:1, name:"فراولة مجمدة",unit:"كيلو", price:40, label:"فريش",   desc:"IQF محفوظة فورياً", image:"https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&q=80", note:"IQF" },
      { id:2, name:"خضار مشكل",  unit:"كيلو", price:25, label:"مستورد", desc:"بروكلي وجزر وذرة", image:"https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?w=300&q=80", note:"أوروبي" },
      { id:3, name:"مانجو مجمد", unit:"كيلو", price:55, label:"موسمي",  desc:"جاهز للعصائر", image:"https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=300&q=80", note:"مصري" },
    ],
  },
  {
    id: "dried", name: "مجففات", nameEn: "Dried", emoji: "🌾",
    color: "#7c3aed", accent: "#c4b5fd", dark: "#2e1065",
    image: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=600&q=80",
    description: "مجففات طبيعية محفوظة قيمتها الغذائية الكاملة.",
    items: [
      { id:1, name:"تين مجفف",     unit:"250جم", price:45, label:"مستورد",  desc:"تركي غني بالألياف", image:"https://images.unsplash.com/photo-1536304993881-ff86e0c9b589?w=300&q=80", note:"تركي" },
      { id:2, name:"مشمش مجفف",   unit:"500جم", price:55, label:"عرض خاص", desc:"بدون كبريت طبيعي", image:"https://images.unsplash.com/photo-1593001872095-7d5b3868fb1d?w=300&q=80", note:"بدون كبريت" },
      { id:3, name:"توت أسود مجفف",unit:"200جم", price:80, label:"جديد",    desc:"سوبرفود مضادات أكسدة", image:"https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=300&q=80", note:"سوبرفود" },
    ],
  },
  {
    id: "processed", name: "مصنعات", nameEn: "Processed", emoji: "🏭",
    color: "#374151", accent: "#9ca3af", dark: "#030712",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
    description: "منتجات مصنعة بمعايير سلامة غذائية صارمة.",
    items: [
      { id:1, name:"صلصة طماطم", unit:"علبة", price:18, label:"جديد",      desc:"طبيعية بدون حافظات", image:"https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=300&q=80", note:"100% طبيعي" },
      { id:2, name:"معجون طماطم",unit:"علبة", price:12, label:"عرض خاص",  desc:"مركز 28% عالي الجودة", image:"https://images.unsplash.com/photo-1561136594-7f68413baa99?w=300&q=80", note:"مركز 28%" },
    ],
  },
  {
    id: "dairy", name: "مواد غذائية & ألبان", nameEn: "Food & Dairy", emoji: "🥛",
    color: "#1d4ed8", accent: "#93c5fd", dark: "#172554",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80",
    description: "ألبان طازجة ومنتجات يومية من أفضل المزارع.",
    items: [
      { id:1, name:"حليب طازج",   unit:"لتر",   price:20, label:"فريش",        desc:"بقري طازج كامل الدسم", image:"https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80", note:"يومي" },
      { id:2, name:"زبادي بلدي",  unit:"كيلو",  price:25, label:"فريش",        desc:"كثيف غني بالبروبيوتيك", image:"https://images.unsplash.com/photo-1488477181899-9f71b8f1c54b?w=300&q=80", note:"يومي" },
      { id:3, name:"جبن أبيض",    unit:"كيلو",  price:55, label:"فريش",        desc:"طري طازج للفطار", image:"https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&q=80", note:"يومي" },
      { id:4, name:"قشطة طازجة", unit:"250جم", price:30, label:"كمية محدودة", desc:"كاملة الدسم محدودة", image:"https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80", note:"محدود" },
    ],
  },
  {
    id: "pickles", name: "مخللات", nameEn: "Pickles", emoji: "🫙",
    color: "#166534", accent: "#86efac", dark: "#052e16",
    image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&q=80",
    description: "مخللات تقليدية وعصرية بوصفات أصيلة ونكهات مميزة.",
    items: [
      { id:1, name:"خيار مخلل",  unit:"برطمان", price:22, label:"فريش",      desc:"مصري بالثوم والشبت", image:"https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=300&q=80", note:"مصري" },
      { id:2, name:"زيتون أسود", unit:"كيلو",   price:65, label:"مستورد",    desc:"مغربي بالزعتر والليمون", image:"https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&q=80", note:"مغربي" },
      { id:3, name:"مخلل مشكل", unit:"برطمان", price:30, label:"عرض خاص",  desc:"تشكيلة خضار متنوعة", image:"https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=300&q=80", note:"تشكيلة" },
    ],
  },
];
