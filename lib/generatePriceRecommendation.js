function generatePriceRecommendation(equipmentCategory, condition, attributes, recentSales) {
  if (typeof equipmentCategory !== 'string' || !Array.isArray(recentSales) || (attributes !== undefined && (attributes === null || typeof attributes !== 'object' || Array.isArray(attributes)))) throw new TypeError('Invalid input');
  const validConditions = ['good', 'fair', 'poor', 'new'];
  if (!validConditions.includes(condition)) condition = 'fair';
  if (!recentSales || recentSales.length === 0) {
    return { recommendedPrice: null, confidenceScore: 0, priceRange: null };
  }
  const defaultAttributes = { year: 2020, hours: 1000, brand: 'generic' };
  const mergedAttributes = { ...defaultAttributes, ...(attributes || {}) };
  if (!Number.isFinite(mergedAttributes.year) || !Number.isFinite(mergedAttributes.hours)) throw new TypeError('Non-numeric attributes');
  const conditionMultiplier = { new: 1.2, good: 1.0, fair: 0.8, poor: 0.6 };
  const condMult = conditionMultiplier[condition] || 1.0;
  const year = mergedAttributes.year;
  const hours = mergedAttributes.hours;
  const currentYear = new Date().getFullYear();
  const ageFactor = Math.max(0.5, 1 - (currentYear - year) * 0.05);
  const hoursFactor = Math.max(0.5, 1 - (hours / 10000));
  const relevantSales = recentSales.filter(s => {
    return s && (!s.equipmentCategory || s.equipmentCategory === equipmentCategory) && validConditions.includes(s.condition);
  });
  if (relevantSales.length === 0) {
    return { recommendedPrice: null, confidenceScore: 0, priceRange: null };
  }
  const prices = relevantSales.map(s => s.price).filter(p => Number.isFinite(p) && p >= 0);
  if (prices.length === 0) {
    return { recommendedPrice: null, confidenceScore: 0, priceRange: null };
  }
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const basePrice = avgPrice * condMult * ageFactor * hoursFactor;
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const low = sortedPrices[0] * condMult * ageFactor * hoursFactor;
  const high = sortedPrices[sortedPrices.length - 1] * condMult * ageFactor * hoursFactor;
  const confidenceScore = Math.min(1, prices.length / 10);
  return {
    recommendedPrice: Math.round(basePrice * 100) / 100,
    confidenceScore: Math.round(confidenceScore * 100) / 100,
    priceRange: {
      low: Math.round(low * 100) / 100,
      high: Math.round(high * 100) / 100
    }
  };
}
module.exports = { generatePriceRecommendation };
