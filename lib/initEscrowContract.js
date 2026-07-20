function initEscrowContract(sellerId, buyerId, listingId, price) {
  if (typeof sellerId !== 'string' || !sellerId.trim() || typeof buyerId !== 'string' || !buyerId.trim() || typeof listingId !== 'string' || !listingId.trim() || price === undefined || price === null) {
    throw 'MissingField';
  }
  if (!Number.isFinite(price) || price <= 0) {
    throw 'InvalidPrice';
  }
  if (sellerId === buyerId) {
    throw 'SelfTransaction';
  }
  const escrowStore = initEscrowContract._escrowStore || (initEscrowContract._escrowStore = new Set());
  if (escrowStore.has(listingId)) {
    throw 'DuplicateEscrow';
  }
  const contractId = 'escrow_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const createdAt = new Date().toISOString();
  escrowStore.add(listingId);
  return { contractId, status: 'pending', createdAt };
}

module.exports = { initEscrowContract };
