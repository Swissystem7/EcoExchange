function computeTrustScore(userId, transactions, reviews) {
  if (!transactions || transactions.length === 0) {
    return { score: 50, factors: { completionRate: 0, disputePenalty: 0, reviewAvg: 0, recencyBonus: 0 } };
  }
  const total = transactions.length;
  let completed = 0;
  let disputed = 0;
  let lastActivityDate = null;
  for (let i = 0; i < total; i++) {
    const t = transactions[i];
    if (t.status === 'completed') completed++;
    else if (t.status === 'disputed') disputed++;
    const d = new Date(t.createdAt);
    const ts = d.getTime();
    if (!isNaN(ts) && ts >= 0) {
      if (lastActivityDate === null || d > lastActivityDate) lastActivityDate = d;
    }
  }
  const completionRate = total > 0 ? (completed / total) * 40 : 0;
  const disputePenalty = Math.min(disputed * 10, 40);
  let reviewAvg = 0;
  if (reviews && reviews.length > 0) {
    let sum = 0;
    for (let i = 0; i < reviews.length; i++) {
      sum += reviews[i].rating;
    }
    reviewAvg = (sum / reviews.length / 5) * 20;
  }
  let recencyBonus = 0;
  if (lastActivityDate !== null) {
    const now = new Date();
    const diffMs = now.getTime() - lastActivityDate.getTime();
    const daysSince = Math.max(0, diffMs / (1000 * 60 * 60 * 24));
    recencyBonus = 10 * (1 - (daysSince / 365));
    if (recencyBonus < 0) recencyBonus = 0;
    if (recencyBonus > 10) recencyBonus = 10;
  }
  let score = completionRate - disputePenalty + reviewAvg + recencyBonus;
  if (score < 0) score = 0;
  if (score > 100) score = 100;
  if (disputed === total && total > 0) score = 0;
  return {
    score: Math.round(score),
    factors: {
      completionRate: Math.round(completionRate),
      disputePenalty: Math.round(disputePenalty),
      reviewAvg: Math.round(reviewAvg),
      recencyBonus: Math.round(recencyBonus)
    }
  };
}
module.exports = { computeTrustScore };
