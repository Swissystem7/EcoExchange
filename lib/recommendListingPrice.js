function recommendListingPrice(listingAttributes, marketData, sellerUrgency = 90) {
  if (!listingAttributes || typeof listingAttributes !== 'object' || !Array.isArray(marketData)) return null;
  const { category, subcategory, condition, make, model, year, hoursUsed, location } = listingAttributes;
  if (!category) return null;
  const msrpMap = {
    'electronics': { 'laptop': 1200, 'phone': 800, 'tablet': 600, 'default': 500 },
    'vehicles': { 'car': 30000, 'motorcycle': 10000, 'default': 15000 },
    'furniture': { 'sofa': 1500, 'table': 500, 'default': 300 },
    'default': 1000
  };
  if (!Object.prototype.hasOwnProperty.call(msrpMap, category) || category === 'default') return null;
  const subMsrp = msrpMap[category];
  const msrp = typeof subMsrp === 'object' ? (subMsrp[subcategory] || subMsrp['default']) : subMsrp;
  const conditionMultiplier = { 'new': 0.9, 'like new': 0.8, 'good': 0.7, 'fair': 0.5, 'poor': 0.3 };
  const effectiveYear = year || (new Date().getFullYear() - 5);
  const yearsOld = new Date().getFullYear() - effectiveYear;
  let recommendedPrice, lowerBound, upperBound, confidence;
  const validMarket = marketData.filter(d => d && Number.isFinite(d.soldPrice) && d.soldPrice >= 0 && Number.isFinite(d.yearsOld));
  if (validMarket.length >= 10) {
    const filtered = validMarket.filter(d => d.condition === condition && Math.abs(d.yearsOld - yearsOld) <= 2);
    if (filtered.length > 0) {
      const sorted = filtered.map(d => d.soldPrice).sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      recommendedPrice = median;
      lowerBound = 0.85 * median;
      upperBound = 1.15 * median;
      confidence = 'high';
    } else {
      const prices = validMarket.map(d => d.soldPrice);
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
      const sd = Math.sqrt(prices.reduce((sum, p) => sum + (p - avg) ** 2, 0) / prices.length);
      recommendedPrice = avg;
      lowerBound = avg - sd;
      upperBound = avg + sd;
      confidence = 'medium';
    }
  } else if (validMarket.length >= 3) {
    const prices = validMarket.map(d => d.soldPrice);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    const sd = Math.sqrt(prices.reduce((sum, p) => sum + (p - avg) ** 2, 0) / prices.length);
    recommendedPrice = avg;
    lowerBound = avg - sd;
    upperBound = avg + sd;
    confidence = 'medium';
  } else {
    const mult = conditionMultiplier[condition] || 0.5;
    recommendedPrice = msrp * mult;
    lowerBound = 0.7 * recommendedPrice;
    upperBound = 1.3 * recommendedPrice;
    confidence = 'low';
  }
  if (Number.isFinite(sellerUrgency) && sellerUrgency >= 0 && sellerUrgency < 30) {
    recommendedPrice *= 0.95;
    lowerBound *= 0.95;
    upperBound *= 0.95;
  }
  if (Number.isFinite(hoursUsed) && hoursUsed > 10000) {
    recommendedPrice *= 0.9;
    lowerBound *= 0.9;
    upperBound *= 0.9;
  }
  recommendedPrice = Math.max(0, recommendedPrice);
  lowerBound = Math.max(0, lowerBound);
  upperBound = Math.max(0, upperBound);
  return { recommendedPrice, lowerBound, upperBound, confidence };
}
module.exports = { recommendListingPrice };
