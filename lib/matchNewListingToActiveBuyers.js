function matchNewListingToActiveBuyers(listing, activeBuyers) {
  if (!activeBuyers || activeBuyers.length === 0) return [];

  const matchedBuyers = activeBuyers.map(buyer => {
    const criteria = buyer.searchCriteria || {};
    const purchaseHistory = buyer.purchaseHistory || [];

    let categoryScore = 0;
    if (criteria.category) {
      categoryScore = listing.category === criteria.category ? 1 : 0;
    } else {
      categoryScore = 1;
    }

    let keywordScore = 0;
    if (criteria.keywords && criteria.keywords.length > 0) {
      const listingText = `${listing.make} ${listing.model} ${listing.year}`.toLowerCase();
      const matchedKeywords = criteria.keywords.filter(kw => listingText.includes(kw.toLowerCase()));
      keywordScore = criteria.keywords.length > 0 ? matchedKeywords.length / criteria.keywords.length : 0;
    } else {
      keywordScore = 1;
    }

    let priceScore = 0;
    if (criteria.priceRange) {
      const { min, max } = criteria.priceRange;
      if (min !== undefined && max !== undefined) {
        if (listing.price >= min && listing.price <= max) {
          priceScore = 1;
        } else {
          const mid = (min + max) / 2;
          const maxDist = Math.max(mid - min, max - mid);
          const dist = Math.abs(listing.price - mid);
          priceScore = maxDist > 0 ? Math.max(0, 1 - dist / maxDist) : 0;
        }
      } else if (min !== undefined) {
        priceScore = listing.price >= min ? 1 : Math.max(0, 1 - (min - listing.price) / min);
      } else if (max !== undefined) {
        priceScore = listing.price <= max ? 1 : Math.max(0, 1 - (listing.price - max) / max);
      }
    } else {
      priceScore = 1;
    }

    let geoScore = 0;
    if (criteria.locationRadius && criteria.locationRadius > 0 && listing.location) {
      const buyerCity = criteria.locationRadius.city || '';
      const sellerCity = listing.location.city || '';
      if (buyerCity && sellerCity && buyerCity.toLowerCase() === sellerCity.toLowerCase()) {
        geoScore = 1;
      } else {
        geoScore = 0;
      }
    } else {
      geoScore = 1;
    }

    let pastPurchaseScore = 0;
    if (purchaseHistory.length > 0) {
      const matchingCategories = purchaseHistory.filter(cat => cat === listing.category);
      pastPurchaseScore = matchingCategories.length / purchaseHistory.length;
    } else {
      pastPurchaseScore = 1;
    }

    const matchScore = categoryScore * 0.3 + keywordScore * 0.25 + priceScore * 0.2 + geoScore * 0.15 + pastPurchaseScore * 0.1;

    const matchReasons = [];
    if (categoryScore === 1) matchReasons.push('Category matches');
    if (keywordScore > 0) matchReasons.push('Keywords overlap');
    if (priceScore > 0.5) matchReasons.push('Price within budget');
    if (geoScore === 1) matchReasons.push('Same city');
    if (pastPurchaseScore > 0) matchReasons.push('Past purchase similarity');

    return {
      buyerId: buyer.buyerId,
      matchScore: Math.round(matchScore * 100) / 100,
      matchReasons,
      _recency: Number.isNaN(Date.parse(buyer.lastActivity)) ? 0 : Date.parse(buyer.lastActivity)
    };
  });

  matchedBuyers.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    return b._recency - a._recency;
  });

  return matchedBuyers.map(({ _recency, ...match }) => match);
}

module.exports = { matchNewListingToActiveBuyers };
