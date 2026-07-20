function computeUserTrustScore(userId, transactionHistory) {
  const breakdown = { baseScore: 50, successBonus: 0, fraudPenalty: 0, disputePenalty: 0, cancellationPenalty: 0, ratingBonus: 0 };
  if (!Array.isArray(transactionHistory) || transactionHistory.length === 0) {
    return { score: 50, breakdown };
  }
  let successCount = 0;
  let fraudCount = 0;
  let disputeCount = 0;
  let cancellationCount = 0;
  let ratingSum = 0;
  let ratingCount = 0;
  for (const entry of transactionHistory) {
    if (!entry || typeof entry !== 'object' || !entry.type || !entry.outcome) continue;
    if (entry.type !== 'sale' && entry.type !== 'purchase') continue;
    const validOutcomes = ['success', 'dispute', 'fraud', 'cancelled'];
    if (!validOutcomes.includes(entry.outcome)) continue;
    if (entry.outcome === 'success') successCount++;
    else if (entry.outcome === 'fraud') fraudCount++;
    else if (entry.outcome === 'dispute') disputeCount++;
    else if (entry.outcome === 'cancelled') cancellationCount++;
    if (Number.isFinite(entry.rating) && entry.rating >= 0 && entry.rating <= 5) {
      ratingSum += entry.rating;
      ratingCount++;
    }
  }
  const successBonus = Math.min(successCount * 5, 25);
  const fraudPenalty = fraudCount * 20;
  const disputePenalty = disputeCount * 10;
  const cancellationPenalty = cancellationCount * 5;
  let ratingBonus = 0;
  if (ratingCount > 0) {
    const avgRating = ratingSum / ratingCount;
    ratingBonus = Math.max(0, (avgRating - 3) * 2);
  }
  let score = 50 + successBonus - fraudPenalty - disputePenalty - cancellationPenalty + ratingBonus;
  score = Math.max(0, Math.min(100, score));
  breakdown.successBonus = successBonus;
  breakdown.fraudPenalty = fraudPenalty;
  breakdown.disputePenalty = disputePenalty;
  breakdown.cancellationPenalty = cancellationPenalty;
  breakdown.ratingBonus = ratingBonus;
  return { score, breakdown };
}
module.exports = { computeUserTrustScore };
