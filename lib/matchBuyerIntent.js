function matchBuyerIntent(newListing, savedSearches) {
  if (!newListing || typeof newListing !== 'object' || !newListing.attributes || !Number.isFinite(newListing.createdTimestamp) || !Array.isArray(savedSearches)) return [];
  const buyerScores = new Map();
  const listingAttrs = newListing.attributes;
  const listingTime = newListing.createdTimestamp;
  for (const search of savedSearches) {
    if (!search || !Number.isFinite(search.createdTimestamp) || !search.criteria || typeof search.criteria !== 'object' || typeof search.buyerId !== 'string') continue;
    if (search.createdTimestamp > listingTime) continue;
    const criteria = search.criteria;
    const criteriaKeys = Object.keys(criteria);
    if (criteriaKeys.length === 0) continue;
    let matchedCount = 0;
    let allMatch = true;
    for (const key of criteriaKeys) {
      if (listingAttrs[key] === criteria[key]) {
        matchedCount++;
      } else {
        allMatch = false;
        break;
      }
    }
    if (!allMatch) continue;
    const score = matchedCount / criteriaKeys.length;
    if (score >= 0.7) {
      const buyerId = search.buyerId;
      if (!buyerScores.has(buyerId) || score > buyerScores.get(buyerId)) {
        buyerScores.set(buyerId, score);
      }
    }
  }
  const result = [];
  for (const [buyerId, matchScore] of buyerScores) {
    result.push({ buyerId, matchScore });
  }
  return result;
}
module.exports = { matchBuyerIntent };
