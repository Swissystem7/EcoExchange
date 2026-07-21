function generateSmartMatches(sellerId, listingId) {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuid.test(sellerId) || !uuid.test(listingId)) throw new Error('Invalid UUID');
  const transactions = getHistoricalTransactions(sellerId);
  if (!transactions || transactions.length === 0) {
    return { matches: [], totalMatches: 0 };
  }
  const listing = getListingById(listingId);
  if (!listing) {
    return { matches: [], totalMatches: 0 };
  }
  const buyers = getAllBuyers();
  const blockedBuyers = getBlockedBuyers(sellerId);
  const optedOutBuyers = getOptedOutBuyers();
  const matches = [];
  for (const buyer of buyers) {
    if (blockedBuyers.includes(buyer.id) || optedOutBuyers.includes(buyer.id)) {
      continue;
    }
    let score = 0;
    const reasons = [];
    if (listing.category && buyer.preferredCategories && buyer.preferredCategories.includes(listing.category)) {
      score += 40;
      reasons.push("common category");
    }
    const buyerPriceRange = buyer.priceRange || { min: 0, max: Infinity };
    const listingPrice = Number.isFinite(listing.price) ? listing.price : 0;
    const lowerBound = listingPrice * 0.8;
    const upperBound = listingPrice * 1.2;
    if (listingPrice >= buyerPriceRange.min && listingPrice <= buyerPriceRange.max &&
        buyerPriceRange.min <= upperBound && buyerPriceRange.max >= lowerBound) {
      score += 30;
      reasons.push("price range within ±20%");
    }
    const distance = calculateDistance(listing.location, buyer.location);
    if (distance <= 100) {
      score += 30;
      reasons.push("location proximity within 100 miles");
    }
    if (score > 0) {
      matches.push({
        buyerId: buyer.id,
        score: score,
        reason: reasons.join(", ")
      });
    }
  }
  matches.sort((a, b) => b.score - a.score);
  return { matches: matches, totalMatches: matches.length };
}

function getHistoricalTransactions(sellerId) {
  return (globalThis.__matchData || mockData).transactions.filter(t => t.sellerId === sellerId);
}

function getListingById(listingId) {
  return (globalThis.__matchData || mockData).listings.find(l => l.id === listingId) || null;
}

function getAllBuyers() {
  return (globalThis.__matchData || mockData).buyers;
}

function getBlockedBuyers(sellerId) {
  const seller = (globalThis.__matchData || mockData).sellers.find(s => s.id === sellerId);
  return seller ? seller.blockedBuyers : [];
}

function getOptedOutBuyers() {
  return (globalThis.__matchData || mockData).buyers.filter(b => b.optedOut).map(b => b.id);
}

function calculateDistance(loc1, loc2) {
  if (!loc1 || !loc2) return Infinity;
  const R = 3959;
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLon = toRad(loc2.lon - loc1.lon);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI/180);
}

const mockData = {
  transactions: [],
  listings: [],
  buyers: [],
  sellers: []
};

module.exports = { generateSmartMatches };
