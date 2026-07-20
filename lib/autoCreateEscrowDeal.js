function autoCreateEscrowDeal(buyerId, sellerId, itemId, agreedPrice) {
  if (!Number.isFinite(agreedPrice) || agreedPrice <= 0) return { error: "Insufficient funds" };
  const wallets = {
    "buyer1": 1000,
    "buyer2": 50
  };
  const listings = {
    "item1": { sellerId: "seller1", verified: true, sold: false, category: "electronics" },
    "item2": { sellerId: "seller2", verified: false, sold: false, category: "chemicals" },
    "item3": { sellerId: "seller3", verified: true, sold: true, category: "furniture" }
  };
  const buyerWallet = wallets[buyerId];
  if (buyerWallet === undefined || buyerWallet < agreedPrice * 0.1) {
    return { error: "Insufficient funds" };
  }
  const listing = listings[itemId];
  if (!listing) {
    return { error: "Item no longer available" };
  }
  if (listing.sold) {
    return { error: "Item no longer available" };
  }
  if (listing.sellerId !== sellerId || !listing.verified) {
    return { error: "Seller not verified" };
  }
  const releaseConditions = ["buyer_confirms_receipt", "inspection_passed"];
  if (listing.category === "chemicals") {
    releaseConditions.push("third_party_inspection");
  }
  const escrowId = require('crypto').randomUUID();
  return {
    escrowId: escrowId,
    status: "pending",
    terms: {
      depositPercent: 10,
      inspectionDays: 5,
      releaseConditions: releaseConditions
    }
  };
}
module.exports = { autoCreateEscrowDeal };
