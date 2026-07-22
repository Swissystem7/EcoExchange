const payments = new Map();
const listings = new Map();
const users = new Map();

function initializeTestData() {
  listings.set('listing1', { id: 'listing1', sellerId: 'seller1', sold: true, escrow: true, buyerConfirmed: true, confirmedAt: Date.now(), paymentReleased: false });
  listings.set('listing2', { id: 'listing2', sellerId: 'seller2', sold: true, escrow: true, buyerConfirmed: false, confirmedAt: null, paymentReleased: false });
  listings.set('listing3', { id: 'listing3', sellerId: 'seller3', sold: false, escrow: false, buyerConfirmed: false, confirmedAt: null, paymentReleased: false });
  listings.set('listing4', { id: 'listing4', sellerId: 'seller4', sold: true, escrow: true, buyerConfirmed: true, confirmedAt: Date.now(), paymentReleased: true });
  users.set('seller1', { id: 'seller1', completions: 50, disputes: 1, returns: 2 });
  users.set('seller2', { id: 'seller2', completions: 10, disputes: 5, returns: 3 });
  users.set('seller3', { id: 'seller3', completions: 0, disputes: 0, returns: 0 });
  users.set('seller4', { id: 'seller4', completions: 100, disputes: 0, returns: 0 });
}

function calculateTrustScore(seller) {
  if (!seller || seller.completions === 0) return 0;
  const disputeRate = seller.disputes / seller.completions;
  const returnRate = seller.returns / seller.completions;
  const score = 100 - (disputeRate * 50) - (returnRate * 30);
  return Math.max(0, Math.min(100, score));
}

async function processEarlyPayment(listingId, sellerId) {
  if (typeof listingId !== 'string' || !listingId.trim() || typeof sellerId !== 'string' || !sellerId.trim()) {
    return { released: false, reason: 'Invalid listing or seller ID' };
  }

  const listing = listings.get(listingId);
  if (!listing) {
    return { released: false, reason: 'Listing not found' };
  }

  if (listing.sellerId !== sellerId) {
    return { released: false, reason: 'Seller does not own this listing' };
  }

  if (!listing.sold) {
    return { released: false, reason: 'Listing not sold' };
  }

  if (!listing.escrow) {
    return { released: false, reason: 'Listing not sold via escrow' };
  }

  if (listing.paymentReleased) {
    return { released: false, reason: 'Payment already released' };
  }

  const paymentKey = `${listingId}_${sellerId}`;
  if (payments.has(paymentKey)) {
    return { released: false, reason: 'Duplicate call detected, payment already processed' };
  }

  if (!listing.buyerConfirmed) {
    return { released: false, reason: 'Buyer has not confirmed delivery' };
  }

  const confirmedAt = Number(listing.confirmedAt);
  const hoursSinceConfirmation = (Date.now() - confirmedAt) / (1000 * 60 * 60);
  if (!Number.isFinite(confirmedAt) || hoursSinceConfirmation < 0 || hoursSinceConfirmation > 48) {
    return { released: false, reason: 'Buyer confirmation older than 48 hours' };
  }

  const seller = users.get(sellerId);
  const trustScore = calculateTrustScore(seller);
  if (trustScore <= 70) {
    return { released: false, reason: `Seller trust score too low: ${trustScore.toFixed(1)}` };
  }

  payments.set(paymentKey, { released: true, timestamp: Date.now() });
  listing.paymentReleased = true;

  const paymentEvent = {
    type: 'PAYMENT_RELEASED',
    listingId,
    sellerId,
    amount: 100.00,
    timestamp: Date.now()
  };

  return { released: true, reason: 'Payment released successfully' };
}

initializeTestData();

module.exports = { processEarlyPayment };
