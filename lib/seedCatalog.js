const LISTINGS = [
  { id:'EE-001', title:'מחשבי Dell OptiPlex 7090 — מארז קטן, 12 יחידות', category:'מחשוב', condition:'כמו חדש', askPrice:16800, city:'תל אביב-יפו', postedDaysAgo:2 },
  { id:'EE-002', title:'מסכי Lenovo ‏24 אינץ׳ לעמדות עבודה, 20 יחידות', category:'מחשוב', condition:'משומש', askPrice:9000, city:'פתח תקווה', postedDaysAgo:7 },
  { id:'EE-003', title:'שרת HPE ProLiant DL380 Gen10', category:'מחשוב', condition:'משומש', askPrice:14500, city:'הרצליה', postedDaysAgo:13 },
  { id:'EE-004', title:'מתג רשת Cisco Catalyst 9300', category:'מחשוב', condition:'כמו חדש', askPrice:11200, city:'חיפה', postedDaysAgo:1 },
  { id:'EE-005', title:'מחשבים ניידים HP EliteBook 840 G8, שמונה יחידות', category:'מחשוב', condition:'משומש', askPrice:17600, city:'רמת גן', postedDaysAgo:19 },
  { id:'EE-006', title:'מדפסות לייזר Brother משרדיות, שש יחידות', category:'מחשוב', condition:'חדש', askPrice:7200, city:'ראשון לציון', postedDaysAgo:4 },
  { id:'EE-007', title:'תחנות עגינה USB-C, ארגז 25 יחידות', category:'מחשוב', condition:'לחלקים', askPrice:1800, city:'נתניה', postedDaysAgo:31 },
  { id:'EE-008', title:'שולחנות עבודה מתכווננים חשמלית, 14 יחידות', category:'ריהוט משרדי', condition:'כמו חדש', askPrice:15400, city:'תל אביב-יפו', postedDaysAgo:5 },
  { id:'EE-009', title:'כיסאות Herman Miller Aeron, עשר יחידות', category:'ריהוט משרדי', condition:'משומש', askPrice:19000, city:'הרצליה', postedDaysAgo:9 },
  { id:'EE-010', title:'ארונות תיוק מתכת ננעלים, 18 יחידות', category:'ריהוט משרדי', condition:'משומש', askPrice:6300, city:'חולון', postedDaysAgo:22 },
  { id:'EE-011', title:'דלפק קבלה מודולרי בגימור אלון', category:'ריהוט משרדי', condition:'כמו חדש', askPrice:4800, city:'פתח תקווה', postedDaysAgo:11 },
  { id:'EE-012', title:'שולחן ישיבות ל־16 משתתפים', category:'ריהוט משרדי', condition:'משומש', askPrice:5200, city:'באר שבע', postedDaysAgo:28 },
  { id:'EE-013', title:'מחיצות אקוסטיות לעמדות אופן ספייס, 30 יחידות', category:'ריהוט משרדי', condition:'חדש', askPrice:13500, city:'מודיעין-מכבים-רעות', postedDaysAgo:3 },
  { id:'EE-014', title:'כיסאות אורח מרופדים, 24 יחידות', category:'ריהוט משרדי', condition:'לחלקים', askPrice:2200, city:'אשדוד', postedDaysAgo:47 },
  { id:'EE-015', title:'תנור קומבי Rational ‏10 מגשים', category:'ציוד מטבח תעשייתי', condition:'משומש', askPrice:29500, city:'ירושלים', postedDaysAgo:8 },
  { id:'EE-016', title:'מקרר נירוסטה עומד 1,400 ליטר', category:'ציוד מטבח תעשייתי', condition:'כמו חדש', askPrice:11800, city:'חיפה', postedDaysAgo:4 },
  { id:'EE-017', title:'מדיח כלים תעשייתי Hobart עם שולחנות', category:'ציוד מטבח תעשייתי', condition:'משומש', askPrice:16700, city:'אילת', postedDaysAgo:16 },
  { id:'EE-018', title:'מכונת אספרסו La Marzocco Linea דו־ראשית', category:'ציוד מטבח תעשייתי', condition:'כמו חדש', askPrice:23500, city:'תל אביב-יפו', postedDaysAgo:6 },
  { id:'EE-019', title:'מנדף נירוסטה 2.5 מטר כולל מפוח', category:'ציוד מטבח תעשייתי', condition:'משומש', askPrice:7500, city:'ראשון לציון', postedDaysAgo:25 },
  { id:'EE-020', title:'שולחנות הכנה מנירוסטה, חמש יחידות', category:'ציוד מטבח תעשייתי', condition:'חדש', askPrice:8900, city:'כפר סבא', postedDaysAgo:2 },
  { id:'EE-021', title:'מקפיא שוכב תעשייתי — למדחס וחלקים', category:'ציוד מטבח תעשייתי', condition:'לחלקים', askPrice:1200, city:'טבריה', postedDaysAgo:54 },
  { id:'EE-022', title:'פטיש חציבה Hilti TE 3000 עם עגלה', category:'כלי עבודה', condition:'משומש', askPrice:7800, city:'באר שבע', postedDaysAgo:10 },
  { id:'EE-023', title:'מברגות אימפקט Makita ‏18V, עשר יחידות', category:'כלי עבודה', condition:'כמו חדש', askPrice:9500, city:'פתח תקווה', postedDaysAgo:3 },
  { id:'EE-024', title:'מסור שולחן Bosch Professional', category:'כלי עבודה', condition:'משומש', askPrice:3100, city:'חדרה', postedDaysAgo:18 },
  { id:'EE-025', title:'קומפרסור בורגי Atlas Copco ‏15kW', category:'כלי עבודה', condition:'משומש', askPrice:18500, city:'קריית גת', postedDaysAgo:14 },
  { id:'EE-026', title:'רתכת MIG תלת־פאזית כולל מזין חוט', category:'כלי עבודה', condition:'כמו חדש', askPrice:6900, city:'אשדוד', postedDaysAgo:7 },
  { id:'EE-027', title:'סט כלי מדידה לייזר Leica, ארבע יחידות', category:'כלי עבודה', condition:'חדש', askPrice:12400, city:'נתניה', postedDaysAgo:1 },
  { id:'EE-028', title:'מנועים חשמליים וכלי עבודה לפירוק', category:'כלי עבודה', condition:'לחלקים', askPrice:2400, city:'עכו', postedDaysAgo:39 },
  { id:'EE-029', title:'מיטות טיפול חשמליות, שש יחידות', category:'רפואי', condition:'כמו חדש', askPrice:27000, city:'רמת גן', postedDaysAgo:5 },
  { id:'EE-030', title:'מוניטורים למדדים חיוניים Mindray, ארבע יחידות', category:'רפואי', condition:'משומש', askPrice:22000, city:'חיפה', postedDaysAgo:12 },
  { id:'EE-031', title:'מכשיר אולטרסאונד נייד SonoSite M-Turbo', category:'רפואי', condition:'משומש', askPrice:39000, city:'ירושלים', postedDaysAgo:21 },
  { id:'EE-032', title:'עגלות תרופות ננעלות, שמונה יחידות', category:'רפואי', condition:'חדש', askPrice:16000, city:'פתח תקווה', postedDaysAgo:2 },
  { id:'EE-033', title:'כיסאות גלגלים מתקפלים, 15 יחידות', category:'רפואי', condition:'כמו חדש', askPrice:13500, city:'בני ברק', postedDaysAgo:8 },
  { id:'EE-034', title:'מנורת ניתוח LED ניידת', category:'רפואי', condition:'משומש', askPrice:9800, city:'באר שבע', postedDaysAgo:33 },
  { id:'EE-035', title:'משאבות אינפוזיה לא פעילות, 12 יחידות לחלקים', category:'רפואי', condition:'לחלקים', askPrice:3000, city:'רחובות', postedDaysAgo:58 },
  { id:'EE-036', title:'מדפי מחסן מודולריים כבדים, 22 מטר', category:'אחר', condition:'משומש', askPrice:12500, city:'לוד', postedDaysAgo:6 },
  { id:'EE-037', title:'גנרטור דיזל מושתק 60KVA', category:'אחר', condition:'כמו חדש', askPrice:41000, city:'אשקלון', postedDaysAgo:15 },
  { id:'EE-038', title:'מכולת משרד מבודדת 12 מטר', category:'אחר', condition:'משומש', askPrice:26500, city:'קיסריה', postedDaysAgo:29 },
  { id:'EE-039', title:'עגלות שינוע מתקפלות, 30 יחידות', category:'אחר', condition:'חדש', askPrice:10500, city:'ראש העין', postedDaysAgo:1 },
  { id:'EE-040', title:'מערכת אל־פסק תעשייתית 40KVA', category:'אחר', condition:'משומש', askPrice:14800, city:'יקנעם עילית', postedDaysAgo:20 },
  { id:'EE-041', title:'לוחות חשמל תלת־פאזיים לפירוק', category:'אחר', condition:'לחלקים', askPrice:4200, city:'נצרת', postedDaysAgo:44 },
  { id:'EE-042', title:'מלגזה חשמלית Toyota ‏1.8 טון', category:'אחר', condition:'כמו חדש', askPrice:52000, city:'חולון', postedDaysAgo:4 }
];

const seedCatalog = () => LISTINGS.map(item => ({ ...item }));

const marketDepth = (catalog, category) => {
  if (!Array.isArray(catalog)) return { listings: 0, medianPrice: null, priceRange: [null, null] };
  const prices = catalog
    .filter(item => item && item.category === category && Number.isFinite(item.askPrice))
    .map(item => item.askPrice)
    .sort((a, b) => a - b);
  if (!prices.length) return { listings: 0, medianPrice: null, priceRange: [null, null] };
  const middle = Math.floor(prices.length / 2);
  const medianPrice = prices.length % 2 ? prices[middle] : Math.round((prices[middle - 1] + prices[middle]) / 2);
  return { listings: prices.length, medianPrice, priceRange: [prices[0], prices[prices.length - 1]] };
};

module.exports = { seedCatalog, marketDepth };
