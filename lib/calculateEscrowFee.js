function calculateEscrowFee(transactionAmount, sellerTrustScore, buyerTrustScore) {
  if (!Number.isFinite(transactionAmount) || transactionAmount <= 0) {
    throw new Error('transactionAmount must be a positive number');
  }
  if (sellerTrustScore === null || sellerTrustScore === undefined) sellerTrustScore = 0;
  if (buyerTrustScore === null || buyerTrustScore === undefined) buyerTrustScore = 0;
  if (!Number.isFinite(sellerTrustScore) || sellerTrustScore < 0 || sellerTrustScore > 100) {
    throw new Error('sellerTrustScore must be in range [0,100]');
  }
  if (!Number.isFinite(buyerTrustScore) || buyerTrustScore < 0 || buyerTrustScore > 100) {
    throw new Error('buyerTrustScore must be in range [0,100]');
  }
  let baseFee = transactionAmount * 0.03;
  let discount = 0;
  if (transactionAmount >= 100) {
    let trustDiscount = Math.min(sellerTrustScore, buyerTrustScore) * 0.0002;
    if (sellerTrustScore > 80 && buyerTrustScore > 80) {
      trustDiscount += 0.005;
    }
    discount = baseFee * trustDiscount;
  }
  let finalFee = Math.max(baseFee - discount, transactionAmount * 0.005);
  if (transactionAmount > 1000000) {
    finalFee = Math.min(finalFee, transactionAmount * 0.05 + 5000);
  }
  let feePercentage = (finalFee / transactionAmount) * 100;
  return { baseFee, discount, finalFee, feePercentage };
}

module.exports = { calculateEscrowFee };
