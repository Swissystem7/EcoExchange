function calculateTrustScore(userId, history = null) {
  if (!history || history.length === 0) {
    return { score: 50, factors: { baseScore: 50 } };
  }
  const now = Date.now();
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  let baseScore = 50;
  let transactionBonus = 0;
  let disputePenalty = 0;
  let verificationBonus = 0;
  let recencyDecay = 0;
  let totalWeight = 0;
  let weightedBonus = 0;
  let weightedDispute = 0;
  let weightedVerification = 0;
  for (const tx of history) {
    const ageMs = now - new Date(tx.timestamp).getTime();
    let weight = 1;
    if (ageMs > oneYearMs) {
      weight = Math.max(0, 1 - (ageMs - oneYearMs) / oneYearMs);
    }
    totalWeight += weight;
    if (tx.completed) {
      weightedBonus += weight * 20;
    }
    if (tx.disputed) {
      weightedDispute += weight * 30;
    }
    if (tx.verifiedBadge) {
      weightedVerification += weight * 10;
    }
  }
  if (totalWeight > 0) {
    transactionBonus = weightedBonus / totalWeight;
    disputePenalty = -Math.min(30, weightedDispute / totalWeight);
    verificationBonus = weightedVerification / totalWeight;
    const avgAgeMs = history.reduce((sum, tx) => sum + (now - new Date(tx.timestamp).getTime()), 0) / history.length;
    recencyDecay = Math.max(0, 5 * (1 - Math.min(1, avgAgeMs / oneYearMs)));
  }
  let score = Math.round(baseScore + transactionBonus + disputePenalty + verificationBonus + recencyDecay);
  score = Math.max(0, Math.min(100, score));
  return {
    score,
    factors: {
      baseScore,
      transactionBonus: Math.round(transactionBonus),
      disputePenalty: Math.round(disputePenalty),
      verificationBonus: Math.round(verificationBonus),
      recencyDecay: Math.round(recencyDecay)
    }
  };
}
module.exports = { calculateTrustScore };