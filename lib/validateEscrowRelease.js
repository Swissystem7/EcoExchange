function validateEscrowRelease(order) {
  if (typeof order !== 'object' || order === null) {
    throw new TypeError('order must be an object');
  }
  const requiredFields = ['escrowAmount', 'listingPrice', 'buyerConfirmed', 'sellerDelivered', 'inspectionPassed', 'timeoutDays', 'daysSinceDelivery'];
  for (const field of requiredFields) {
    if (!(field in order)) {
      throw new TypeError(`missing field: ${field}`);
    }
  }
  const escrowAmount = Number(order.escrowAmount);
  const listingPrice = Number(order.listingPrice);
  const buyerConfirmed = Boolean(order.buyerConfirmed);
  const sellerDelivered = Boolean(order.sellerDelivered);
  const inspectionPassed = Boolean(order.inspectionPassed);
  const timeoutDays = Number(order.timeoutDays);
  let daysSinceDelivery = Number(order.daysSinceDelivery);
  if (daysSinceDelivery < 0) {
    daysSinceDelivery = 0;
  }
  if (escrowAmount !== listingPrice) {
    return { canRelease: false, reason: 'price mismatch' };
  }
  if (buyerConfirmed && sellerDelivered && inspectionPassed) {
    return { canRelease: true, reason: '' };
  }
  if (daysSinceDelivery > timeoutDays && sellerDelivered) {
    return { canRelease: true, reason: '' };
  }
  return { canRelease: false, reason: 'conditions not met' };
}

module.exports = { validateEscrowRelease };