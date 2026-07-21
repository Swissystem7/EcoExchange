function suggestListingPrice(category, condition, make, model, year, hoursUsed, location) {
  const categoryAverages = {
    'electronics': { min: 50, max: 200, avgDays: 30 },
    'vehicles': { min: 5000, max: 30000, avgDays: 45 },
    'furniture': { min: 100, max: 1000, avgDays: 60 },
    'clothing': { min: 10, max: 100, avgDays: 20 },
    'sports': { min: 20, max: 500, avgDays: 35 },
    'tools': { min: 30, max: 300, avgDays: 40 },
    'other': { min: 25, max: 150, avgDays: 50 }
  };

  const conditionMultipliers = {
    'new': 1.0,
    'like-new': 0.9,
    'good': 0.75,
    'fair': 0.55,
    'poor': 0.35
  };

  const locationMultipliers = {
    'new york': 1.15,
    'los angeles': 1.10,
    'chicago': 1.05,
    'houston': 1.02,
    'phoenix': 0.98,
    'default': 1.0
  };

  if (!category || !categoryAverages[category]) return null;
  hoursUsed = Number.isFinite(hoursUsed) ? Math.max(0, Math.trunc(hoursUsed)) : 0;
  if (!condition || !conditionMultipliers[condition]) condition = 'good';

  const catAvg = categoryAverages[category];
  const condMult = conditionMultipliers[condition];

  let locMult = locationMultipliers['default'];
  if (location) {
    const locLower = location.toLowerCase().trim();
    for (const [key, val] of Object.entries(locationMultipliers)) {
      if (locLower.includes(key)) {
        locMult = val;
        break;
      }
    }
  }

  const currentYear = new Date().getUTCFullYear();
  const normalizedYear = Number.isInteger(year) ? year : currentYear;
  const ageFactor = Math.max(0.5, Math.min(1.0, 1.0 - (currentYear - normalizedYear) * 0.05));
  const hoursFactor = Math.max(0.3, 1.0 - hoursUsed / 10000);

  const baseMin = catAvg.min * condMult * locMult * ageFactor * hoursFactor;
  const baseMax = catAvg.max * condMult * locMult * ageFactor * hoursFactor;

  const suggestedPriceMin = Math.round(baseMin);
  const suggestedPriceMax = Math.round(baseMax);

  const sampleSize = 100;
  const confidence = Math.min(1.0, sampleSize / 500);

  const predictedDaysToSell = Math.round(catAvg.avgDays * (1.0 + (1.0 - condMult) * 0.5) * (1.0 + (1.0 - ageFactor) * 0.3));

  return {
    suggestedPriceMin,
    suggestedPriceMax,
    confidence,
    predictedDaysToSell
  };
}

module.exports = { suggestListingPrice };
