function calculateDynamicCommissionRate(listingCompleteness, verificationLevel, sellerPerformanceScore) {
  if (typeof listingCompleteness !== 'number' || typeof verificationLevel !== 'number' || typeof sellerPerformanceScore !== 'number') {
    return NaN;
  }
  if (!isFinite(listingCompleteness) || !isFinite(verificationLevel) || !isFinite(sellerPerformanceScore)) {
    return NaN;
  }
  let lc = Math.max(0, Math.min(1, listingCompleteness));
  let vl = Math.round(verificationLevel);
  vl = Math.max(0, Math.min(3, vl));
  let sps = Math.max(-1, Math.min(1, sellerPerformanceScore));
  let normPerf = sps < 0 ? 0 : sps;
  let rate = 0.05 + (lc * 0.05) + (vl * 0.02 / 3) + (normPerf * 0.03);
  rate = Math.max(0.05, Math.min(0.15, rate));
  return rate;
}
module.exports = { calculateDynamicCommissionRate };