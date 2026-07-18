const { randomUUID } = require('crypto');

function bundleSuggestions(equipmentId, sellerId) {
  if (typeof equipmentId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(equipmentId)) {
    throw new Error('Invalid equipmentId format');
  }
  if (typeof sellerId !== 'string' || sellerId.trim() === '') {
    throw new Error('sellerId must be non-empty');
  }

  const db = {
    equipment: {
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890': { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Excavator', category: 'mining', sellerId: 'seller1', price: 50000, condition: 'good' },
      'b2c3d4e5-f6a7-8901-bcde-f12345678901': { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', name: 'Conveyor Belt', category: 'conveyor', sellerId: 'seller2', price: 15000, condition: 'excellent' },
      'c3d4e5f6-a7b8-9012-cdef-123456789012': { id: 'c3d4e5f6-a7b8-9012-cdef-123456789012', name: 'Safety Helmet', category: 'safety_gear', sellerId: 'seller3', price: 200, condition: 'good' },
      'd4e5f6a7-b8c9-0123-defa-234567890123': { id: 'd4e5f6a7-b8c9-0123-defa-234567890123', name: 'Drill Rig', category: 'mining', sellerId: 'seller4', price: 80000, condition: 'excellent' },
      'e5f6a7b8-c9d0-1234-efab-345678901234': { id: 'e5f6a7b8-c9d0-1234-efab-345678901234', name: 'Conveyor Roller', category: 'conveyor', sellerId: 'seller5', price: 5000, condition: 'good' },
      'f6a7b8c9-d0e1-2345-fabc-456789012345': { id: 'f6a7b8c9-d0e1-2345-fabc-456789012345', name: 'Safety Gloves', category: 'safety_gear', sellerId: 'seller6', price: 50, condition: 'excellent' },
      'a7b8c9d0-e1f2-3456-abcd-567890123456': { id: 'a7b8c9d0-e1f2-3456-abcd-567890123456', name: 'Conveyor Motor', category: 'conveyor', sellerId: 'seller7', price: 12000, condition: 'good' },
    },
    categoryMapping: {
      'mining': ['conveyor', 'safety_gear'],
      'conveyor': ['mining', 'safety_gear'],
      'safety_gear': ['mining', 'conveyor'],
    },
    conditionScore: { 'poor': 20, 'fair': 40, 'good': 60, 'excellent': 80, 'new': 100 },
  };

  const equipment = db.equipment[equipmentId];
  if (!equipment) {
    throw new Error('equipment not found');
  }

  const category = equipment.category;
  const complementaryCategories = db.categoryMapping[category];
  if (!complementaryCategories || complementaryCategories.length === 0) {
    return [];
  }

  const allComplementaryListings = [];
  for (const compCat of complementaryCategories) {
    const listings = Object.values(db.equipment).filter(e =>
      e.category === compCat && e.sellerId !== sellerId &&
      ['good', 'excellent', 'new'].includes(e.condition) && Number.isFinite(e.price) && e.price > 0
    );
    allComplementaryListings.push(...listings);
  }

  if (allComplementaryListings.length < 2) {
    return [];
  }

  const uniqueSellers = [...new Set(allComplementaryListings.map(l => l.sellerId))];
  if (uniqueSellers.length < 2) {
    return [];
  }

  const sortedByCategory = {};
  for (const compCat of complementaryCategories) {
    const catListings = allComplementaryListings.filter(l => l.category === compCat);
    catListings.sort((a, b) => {
      const scoreA = db.conditionScore[a.condition] || 0;
      const scoreB = db.conditionScore[b.condition] || 0;
      return scoreB - scoreA;
    });
    sortedByCategory[compCat] = catListings.slice(0, 3);
  }

  const bundles = [];
  const usedSellerCombos = new Set();

  for (const cat1 of complementaryCategories) {
    for (const cat2 of complementaryCategories) {
      if (cat1 === cat2) continue;
      const list1 = sortedByCategory[cat1] || [];
      const list2 = sortedByCategory[cat2] || [];
      for (const item1 of list1) {
        for (const item2 of list2) {
          if (item1.sellerId === item2.sellerId) continue;
          const sellerKey = [item1.sellerId, item2.sellerId].sort().join('-');
          if (usedSellerCombos.has(sellerKey)) continue;
          usedSellerCombos.add(sellerKey);

          if (typeof item1.price !== 'number' || item1.price <= 0 || typeof item2.price !== 'number' || item2.price <= 0) {
            continue;
          }

          const totalPrice = equipment.price + item1.price + item2.price;
          const platformCommission = totalPrice * 0.04;
          const avgConditionScore = (db.conditionScore[equipment.condition] + db.conditionScore[item1.condition] + db.conditionScore[item2.condition]) / 3;
          const priceDiffRatio = Math.abs(equipment.price - item1.price) / Math.max(equipment.price, item1.price) + Math.abs(equipment.price - item2.price) / Math.max(equipment.price, item2.price);
          const utilityScore = Math.round(((1 - priceDiffRatio) * 0.7 + (avgConditionScore / 100) * 0.3) * 100);
          const clampedUtilityScore = Math.max(0, Math.min(100, utilityScore));

          const bundleId = randomUUID();

          bundles.push({
            bundleId,
            items: [
              { equipmentId: equipment.id, sellerId: equipment.sellerId, price: equipment.price },
              { equipmentId: item1.id, sellerId: item1.sellerId, price: item1.price },
              { equipmentId: item2.id, sellerId: item2.sellerId, price: item2.price },
            ],
            totalPrice,
            platformCommission,
            utilityScore: clampedUtilityScore,
          });
        }
      }
    }
  }

  return bundles;
}

module.exports = { bundleSuggestions };
