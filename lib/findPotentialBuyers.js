function findPotentialBuyers(listingId, buyerProfiles) {
  const listingsDB = {
    "listing1": { category: "excavators", price: 50000, condition: "used", location: { lat: 40.7128, lng: -74.0060 } },
    "listing2": { category: "bulldozers", price: 80000, condition: "new", location: { lat: 34.0522, lng: -118.2437 } },
    "listing3": { category: "cranes", price: 120000, condition: "used", location: { lat: 41.8781, lng: -87.6298 } }
  };

  const listing = listingsDB[listingId];
  if (!listing) throw new Error('Listing not found');

  if (!buyerProfiles || buyerProfiles.length === 0) return [];

  const mergedBuyers = new Map();
  for (const profile of buyerProfiles) {
    const existing = mergedBuyers.get(profile.buyerId);
    if (existing) {
      existing.equipmentCategories = [...new Set([...existing.equipmentCategories, ...profile.equipmentCategories])];
      existing.budgetRange = [
        Math.min(existing.budgetRange[0], profile.budgetRange[0]),
        Math.max(existing.budgetRange[1], profile.budgetRange[1])
      ];
      existing.preferredCondition = [...new Set([...existing.preferredCondition, ...profile.preferredCondition])];
      if (profile.geographicPreference) existing.geographicPreference = profile.geographicPreference;
    } else {
      mergedBuyers.set(profile.buyerId, { ...profile });
    }
  }

  const results = [];
  for (const [buyerId, profile] of mergedBuyers) {
    let score = 0;
    const reasons = [];

    if (profile.equipmentCategories.includes(listing.category)) {
      score += 50;
      reasons.push('category match');
    }

    if (listing.price >= profile.budgetRange[0] && listing.price <= profile.budgetRange[1]) {
      score += 30;
      reasons.push('budget overlap');
    }

    if (profile.preferredCondition.includes(listing.condition)) {
      score += 20;
      reasons.push('condition match');
    }

    if (profile.geographicPreference) {
      const [latStr, lngStr] = profile.geographicPreference.split(',');
      const buyerLat = parseFloat(latStr);
      const buyerLng = parseFloat(lngStr);
      const R = 6371;
      const dLat = (listing.location.lat - buyerLat) * Math.PI / 180;
      const dLng = (listing.location.lng - buyerLng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(buyerLat * Math.PI / 180) * Math.cos(listing.location.lat * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      if (distance <= 100) {
        score += 10;
        reasons.push('geographic match');
      }
    }

    results.push({ buyerId, score, reason: reasons.join(', ') });
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

module.exports = { findPotentialBuyers };