function computePerformanceFee(matchConfidence, expectedTransactionValue, sellerMargin) {
  if (typeof matchConfidence !== 'number' || typeof expectedTransactionValue !== 'number' || typeof sellerMargin !== 'number') return 0;
  if (!isFinite(matchConfidence) || !isFinite(expectedTransactionValue) || !isFinite(sellerMargin)) return 0;
  if (expectedTransactionValue <= 0) return 0;
  if (expectedTransactionValue < 100) return 0;
  let mc = matchConfidence;
  if (mc < 0) mc = 0;
  if (mc > 1) mc = 1;
  let sm = sellerMargin;
  if (sm < 0) sm = 0;
  if (sm > 1) sm = 1;
  let fee = mc * expectedTransactionValue * sm * 0.15;
  if (fee < 10) fee = 10;
  return fee;
}
module.exports = { computePerformanceFee };