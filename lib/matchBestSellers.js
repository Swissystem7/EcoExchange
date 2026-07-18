function matchBestSellers(buyerProfile, topK = 5) {
  const sellers = getAllSellers();
  if (!sellers || sellers.length === 0) return [];

  const {
    categories = [],
    location,
    budgetRange = { min: 0, max: Infinity },
    preferredCondition = 'any',
    recentSearches = []
  } = buyerProfile || {};

  const seen = new Set();
  const scored = [];

  for (const seller of sellers) {
    if (seen.has(seller.sellerId)) continue;
    seen.add(seller.sellerId);

    let score = 0;
    const reasons = [];

    // Category overlap (weight 0.4)
    const sellerCats = seller.categories || [];
    const overlapCount = categories.filter(c => sellerCats.includes(c)).length;
    const catScore = categories.length > 0 ? overlapCount / categories.length : 0;
    score += catScore * 0.4;
    if (catScore > 0) reasons.push(`High category overlap (${Math.round(catScore * 100)}%)`);

    // Location proximity (weight 0.3)
    let locScore = 0;
    if (location && seller.location) {
      const dist = getDistance(location.lat, location.lng, seller.location.lat, seller.location.lng);
      if (dist <= location.maxRadiusKm) {
        locScore = 1 - (dist / location.maxRadiusKm);
        reasons.push(`Located ${Math.round(dist)}km away`);
      }
    } else if (!location) {
      locScore = 0.5;
    }
    score += locScore * 0.3;

    // Budget fit (weight 0.2)
    const sellerPrices = seller.inventoryPrices || [];
    const budgetMin = budgetRange.min || 0;
    const budgetMax = budgetRange.max || Infinity;
    const hasFullFit = sellerPrices.some(p => p >= budgetMin && p <= budgetMax);
    const hasPartialFit = sellerPrices.some(p => p >= budgetMin * 0.5 && p <= budgetMax * 1.5);
    let budgetScore = 0;
    if (hasFullFit) {
      budgetScore = 1.0;
      reasons.push('Budget fully matches');
    } else if (hasPartialFit) {
      budgetScore = 0.5;
      reasons.push('Partial budget match');
    }
    score += budgetScore * 0.2;

    // Condition match (weight 0.1)
    const sellerCondition = seller.typicalCondition || 'any';
    let condScore = 0;
    if (preferredCondition === 'any' || sellerCondition === 'any' || preferredCondition === sellerCondition) {
      condScore = 1.0;
      reasons.push('Condition matches');
    } else {
      condScore = 0.5;
      reasons.push('Partial condition match');
    }
    score += condScore * 0.1;

    // Decay for recent searches
    const decayCount = recentSearches.filter(s => sellerCats.includes(s)).length;
    for (let i = 0; i < decayCount; i++) {
      score *= 0.9;
    }

    scored.push({
      sellerId: seller.sellerId,
      matchScore: Math.round(score * 100) / 100,
      reason: reasons.length > 0 ? reasons.join('; ') : 'No specific match'
    });
  }

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, Math.min(topK, scored.length));
}

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getAllSellers() {
  return [
    { sellerId: 's1', categories: ['excavators', 'compressors'], location: { lat: 40.7128, lng: -74.0060 }, inventoryPrices: [50000, 75000], typicalCondition: 'used' },
    { sellerId: 's2', categories: ['excavators'], location: { lat: 40.7282, lng: -73.7949 }, inventoryPrices: [60000], typicalCondition: 'new' },
    { sellerId: 's3', categories: ['compressors', 'generators'], location: { lat: 40.7580, lng: -73.9855 }, inventoryPrices: [30000, 45000], typicalCondition: 'used' },
    { sellerId: 's4', categories: ['excavators', 'bulldozers'], location: { lat: 40.6892, lng: -74.0445 }, inventoryPrices: [80000], typicalCondition: 'new' },
    { sellerId: 's5', categories: ['compressors'], location: { lat: 40.7484, lng: -73.9857 }, inventoryPrices: [25000], typicalCondition: 'used' }
  ];
}

module.exports = { matchBestSellers };