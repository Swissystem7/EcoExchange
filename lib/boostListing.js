function boostListing(listingId) {
  const listing = getListingById(listingId);
  if (!listing || listing.expired) return null;
  const views = getViewsLast7Days(listingId);
  if (views !== 0) return null;
  const categoryDemand = getCategoryDemandPercentile(listing.category);
  if (categoryDemand === null || categoryDemand <= 75) return null;
  const newPrice = Math.round(listing.currentPrice * 0.9);
  if (listing.minPrice !== undefined && listing.minPrice !== null && newPrice < listing.minPrice) return null;
  return {
    newPrice: newPrice,
    relistedAt: new Date().toISOString(),
    reason: 'Low visibility, demand high'
  };
}
function getListingById(id) {
  const listings = {
    '1': { currentPrice: 100, minPrice: 80, category: 'electronics', expired: false },
    '2': { currentPrice: 50, minPrice: null, category: 'clothing', expired: true },
    '3': { currentPrice: 200, minPrice: 190, category: 'furniture', expired: false }
  };
  return listings[id] || null;
}
function getViewsLast7Days(id) {
  const views = { '1': 0, '2': 5, '3': 0 };
  return views[id] !== undefined ? views[id] : 0;
}
function getCategoryDemandPercentile(category) {
  const demand = { 'electronics': 90, 'clothing': 50, 'furniture': 80 };
  return demand[category] !== undefined ? demand[category] : null;
}
module.exports = { boostListing };