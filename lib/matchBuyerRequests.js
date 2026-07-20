function matchBuyerRequests(sellerListingId) {
  const listing = getListingById(sellerListingId);
  if (!listing) {
    throw new Error('Listing not found');
  }
  if (listing.status === 'sold') {
    return { matchedRequests: [] };
  }
  const buyerRequests = getActiveBuyerRequests();
  const previousMatches = getPreviousMatchesForListing(sellerListingId);
  const previousMatchRequestIds = new Set(previousMatches.map(m => m.requestId));
  const matchedRequests = [];
  for (const request of buyerRequests) {
    if (request.category !== listing.category) continue;
    if (!isWithinRadius(listing.location, request.location, request.radius)) continue;
    if (request.requestedPrice < listing.price) continue;
    if (previousMatchRequestIds.has(request.id)) continue;
    if (request.buyerDisabled) continue;
    matchedRequests.push({
      requestId: request.id,
      buyerId: request.buyerId,
      requestedPrice: request.requestedPrice
    });
  }
  return { matchedRequests };
}

function getListingById(id) {
  const listings = {
    'listing1': { id: 'listing1', category: 'tractor', location: { lat: 40.7128, lng: -74.0060 }, price: 15000, status: 'active' },
    'listing2': { id: 'listing2', category: 'harvester', location: { lat: 34.0522, lng: -118.2437 }, price: 25000, status: 'sold' }
  };
  return listings[id] || null;
}

function getActiveBuyerRequests() {
  return [
    { id: 'req1', buyerId: 'buyer1', category: 'tractor', location: { lat: 40.7300, lng: -74.0000 }, radius: 50, requestedPrice: 14000, buyerDisabled: false },
    { id: 'req2', buyerId: 'buyer2', category: 'tractor', location: { lat: 40.7000, lng: -73.9000 }, radius: 30, requestedPrice: 16000, buyerDisabled: false },
    { id: 'req3', buyerId: 'buyer3', category: 'harvester', location: { lat: 34.0500, lng: -118.2500 }, radius: 20, requestedPrice: 26000, buyerDisabled: true },
    { id: 'req4', buyerId: 'buyer4', category: 'tractor', location: { lat: 41.0000, lng: -74.5000 }, radius: 100, requestedPrice: 12000, buyerDisabled: false }
  ];
}

function getPreviousMatchesForListing(listingId) {
  const matches = {
    'listing1': [{ requestId: 'req1' }]
  };
  return matches[listingId] || [];
}

function isWithinRadius(listingLoc, requestLoc, radiusKm) {
  const R = 6371;
  const dLat = (requestLoc.lat - listingLoc.lat) * Math.PI / 180;
  const dLng = (requestLoc.lng - listingLoc.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(listingLoc.lat * Math.PI / 180) * Math.cos(requestLoc.lat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance <= radiusKm;
}

module.exports = { matchBuyerRequests };