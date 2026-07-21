function rankMatches(userId, listings, userBudget, userPreferences) {
  if (!Array.isArray(listings) || listings.length === 0) return [];
  if (typeof userId !== 'string' || !userId.trim()) {
    console.warn("Warning: userId not found in system");
    return [];
  }
  const budget = (userBudget !== undefined && userBudget !== null && userBudget > 0) ? userBudget : Infinity;
  const prefs = userPreferences || {};
  const hasPrefs = Object.keys(prefs).length > 0;
  const results = [];
  for (const listing of listings) {
    if (!listing || typeof listing !== "object") continue;
    const { listingId, price, isVerified, category, condition, attributes, sellerTier } = listing;
    if (listingId === undefined || listingId === null) continue;
    if (!Number.isFinite(price) || price < 0) continue;
    const p = price;
    const budgetFit = p <= budget ? 1 : 0;
    let preferenceMatch = 0.5;
    if (hasPrefs) {
      let matchCount = 0;
      let totalChecks = 0;
      if (prefs.minYear !== undefined && attributes && attributes.year !== undefined) {
        totalChecks++;
        if (attributes.year >= prefs.minYear) matchCount++;
      }
      if (prefs.maxHours !== undefined && attributes && attributes.hours !== undefined) {
        totalChecks++;
        if (attributes.hours <= prefs.maxHours) matchCount++;
      }
      if (prefs.preferredBrand !== undefined && attributes && attributes.brand !== undefined) {
        totalChecks++;
        if (attributes.brand === prefs.preferredBrand) matchCount++;
      }
      if (prefs.maxDistance !== undefined && attributes && attributes.distance !== undefined) {
        totalChecks++;
        if (attributes.distance <= prefs.maxDistance) matchCount++;
      }
      preferenceMatch = totalChecks > 0 ? matchCount / totalChecks : 0.5;
    }
    const verified = isVerified === true;
    const tierBonus = Number.isFinite(sellerTier) ? Math.min(Math.max(sellerTier, 0), 1) * 0.2 : 0;
    const revenuePotential = Math.min(1, (verified ? 0.8 : 0.2) + tierBonus);
    const score = 0.4 * budgetFit + 0.3 * preferenceMatch + 0.3 * revenuePotential;
    const commissionRate = verified ? 0.08 : 0.05;
    const commissionEstimate = p * commissionRate;
    results.push({ listingId: String(listingId), score, commissionEstimate, listing });
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}
module.exports = { rankMatches };
