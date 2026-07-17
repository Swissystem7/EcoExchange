function findBestMatches(buyerQuery, listings) {
  const conditionRank = {
    'New': 5,
    'Used-Like New': 4,
    'Used-Good': 3,
    'Used-Fair': 2,
    'Used-Poor': 1
  };

  const defaults = {
    category: '',
    keywords: '',
    maxPrice: Infinity,
    minCondition: 'Used-Poor'
  };

  const query = { ...defaults, ...buyerQuery };
  const minRank = conditionRank[query.minCondition] || 1;
  const seenIds = new Set();
  const matches = [];

  for (const listing of listings) {
    if (!listing || typeof listing !== 'object') continue;

    const { listingId, category, title, description, price, condition, sellerRating } = listing;

    if (!listingId || seenIds.has(listingId)) continue;
    seenIds.add(listingId);

    const lCondition = condition || 'Used-Poor';
    const lRank = conditionRank[lCondition] || 1;
    if (lRank < minRank) continue;

    // Price: missing/undefined -> no constraint (Infinity). Present but invalid
    // (non-number, NaN, or negative) -> skip listing per spec.
    let lPrice;
    if (price === undefined || price === null) {
      lPrice = Infinity;
    } else if (typeof price !== 'number' || isNaN(price) || price < 0) {
      continue;
    } else {
      lPrice = price;
    }
    if (query.maxPrice !== Infinity && lPrice > query.maxPrice) continue;

    let categoryWeight = (category === query.category) ? 0.3 : 0;

    let keywordWeight = 0;
    if (query.keywords && query.keywords.length > 0) {
      const queryWords = query.keywords.toLowerCase().split(/\s+/).filter(w => w);
      if (queryWords.length > 0) {
        const listingText = ((title || '') + ' ' + (description || '')).toLowerCase();
        const matchCount = queryWords.filter(w => listingText.includes(w)).length;
        keywordWeight = 0.4 * (matchCount / queryWords.length);
      }
    }

    let priceFit = 0;
    if (query.maxPrice !== Infinity && query.maxPrice > 0 && lPrice !== Infinity) {
      priceFit = 0.2 * (1 - lPrice / query.maxPrice);
    }

    let rating = typeof sellerRating === 'number' ? Math.max(0, Math.min(5, sellerRating)) : 0;
    const ratingWeight = 0.1 * (rating / 5);

    const total = categoryWeight + keywordWeight + priceFit + ratingWeight;
    const relevanceScore = Math.min(1, total);

    matches.push({ listingId, relevanceScore });
  }

  matches.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return { matches };
}

module.exports = { findBestMatches };