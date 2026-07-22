function determineEscrowRelease(listingId, buyerConfirmation, daysSinceDelivery, sellerTrustScore, buyerTrustScore, transactionValue) {
  if (!Number.isFinite(transactionValue) || transactionValue <= 0) {
    return { releaseAmount: 0, holdbackAmount: 0, reason: 'invalid value' };
  }
  if (!Number.isInteger(daysSinceDelivery)) daysSinceDelivery = 0;
  if (!Number.isFinite(sellerTrustScore)) sellerTrustScore = 0;
  if (!Number.isFinite(buyerTrustScore)) buyerTrustScore = 0;
  if (sellerTrustScore < 0) sellerTrustScore = 0;
  if (sellerTrustScore > 100) sellerTrustScore = 100;
  if (buyerTrustScore < 0) buyerTrustScore = 0;
  if (buyerTrustScore > 100) buyerTrustScore = 100;

  let releaseAmount, holdbackAmount, reason;

  if (buyerConfirmation) {
    if (transactionValue > 100000 && sellerTrustScore <= 90) {
      holdbackAmount = Math.round(transactionValue * 0.2 * 100) / 100;
      releaseAmount = Math.round((transactionValue - holdbackAmount) * 100) / 100;
      reason = 'buyer confirmed - high value holdback';
    } else {
      holdbackAmount = Math.round(transactionValue * 0.1 * 100) / 100;
      releaseAmount = Math.round((transactionValue - holdbackAmount) * 100) / 100;
      reason = 'buyer confirmed - standard holdback';
    }
  } else if (daysSinceDelivery >= 14) {
    if (sellerTrustScore >= 70) {
      holdbackAmount = Math.round(transactionValue * 0.05 * 100) / 100;
      releaseAmount = Math.round((transactionValue - holdbackAmount) * 100) / 100;
      reason = 'timeout - high trust seller';
    } else if (sellerTrustScore >= 40) {
      holdbackAmount = Math.round(transactionValue * 0.2 * 100) / 100;
      releaseAmount = Math.round((transactionValue - holdbackAmount) * 100) / 100;
      reason = 'timeout - moderate trust seller';
    } else {
      holdbackAmount = Math.round(transactionValue * 100) / 100;
      releaseAmount = 0;
      reason = 'timeout - low trust seller - manual review required';
    }
  } else {
    if (buyerTrustScore >= 80) {
      if (transactionValue > 100000) {
        holdbackAmount = Math.round(transactionValue * 0.2 * 100) / 100;
        releaseAmount = Math.round((transactionValue - holdbackAmount) * 100) / 100;
        reason = 'early release due to high buyer trust - high value holdback';
      } else {
        holdbackAmount = Math.round(transactionValue * 0.5 * 100) / 100;
        releaseAmount = Math.round((transactionValue - holdbackAmount) * 100) / 100;
        reason = 'early release due to high buyer trust';
      }
    } else {
      holdbackAmount = Math.round(transactionValue * 100) / 100;
      releaseAmount = 0;
      reason = 'awaiting buyer confirmation or timeout';
    }
  }

  if (transactionValue > 100000 && !(buyerConfirmation && sellerTrustScore > 90)) {
    const minimumHoldback = Math.round(transactionValue * 0.2 * 100) / 100;
    if (holdbackAmount < minimumHoldback) {
      holdbackAmount = minimumHoldback;
      releaseAmount = Math.round((transactionValue - holdbackAmount) * 100) / 100;
      reason += ' - high value holdback';
    }
  }
  return { releaseAmount, holdbackAmount, reason };
}

module.exports = { determineEscrowRelease };
