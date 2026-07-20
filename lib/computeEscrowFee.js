function computeEscrowFee(transactionAmount, speed) {
  if (typeof transactionAmount !== 'number' || Number.isNaN(transactionAmount) || transactionAmount <= 0) {
    return { fee: 0, feeBasisPoints: 0 };
  }
  const normalizedSpeed = (speed === 'express') ? 'express' : 'standard';
  let feeBasisPoints, maxFee;
  if (normalizedSpeed === 'express') {
    feeBasisPoints = 80;
    maxFee = 8000;
  } else {
    feeBasisPoints = 50;
    maxFee = 5000;
  }
  const rawFee = transactionAmount * (feeBasisPoints / 10000);
  const fee = Math.min(rawFee, maxFee);
  const roundedFee = Math.round(fee * 100) / 100;
  return { fee: roundedFee, feeBasisPoints };
}
module.exports = { computeEscrowFee };
