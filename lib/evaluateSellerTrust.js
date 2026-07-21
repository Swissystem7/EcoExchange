function evaluateSellerTrust(sellerId) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sellerId)) throw new Error('Invalid sellerId');
  const transactions = getTransactions(sellerId);
  if (!transactions || transactions.length === 0) {
    return { trustScore: 0, autoReleaseEligible: false };
  }
  const totalSales = transactions.length;
  let onTimeDeliveries = 0;
  let positiveConditionReports = 0;
  let totalDisputes = 0;
  let earliestDate = null;
  for (const t of transactions) {
    if (t.deliveredOnTime) onTimeDeliveries++;
    if (t.conditionMatch) positiveConditionReports++;
    if (t.dispute) totalDisputes++;
    const date = new Date(t.date);
    if (Number.isFinite(date.getTime()) && (!earliestDate || date < earliestDate)) earliestDate = date;
  }
  const completionRate = totalSales > 0 ? onTimeDeliveries / totalSales : 0;
  const conditionMatchRate = totalSales > 0 ? positiveConditionReports / totalSales : 0;
  const accountAgeMonths = earliestDate ? Math.max(0, (Date.now() - earliestDate.getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0;
  const disputePenalty = totalDisputes > 0 ? Math.min(totalDisputes * 10, 100) : 0;
  let trustScore = Math.round(completionRate * 50 + conditionMatchRate * 30 + Math.min(accountAgeMonths / 12, 1) * 20 - disputePenalty);
  trustScore = Math.max(0, Math.min(100, trustScore));
  if (totalSales === 1 && onTimeDeliveries === 1 && positiveConditionReports === 1 && totalDisputes === 0) {
    trustScore = 50;
  }
  return { trustScore, autoReleaseEligible: trustScore >= 80 };
}
function getTransactions(sellerId) {
  return global.__mockTransactions && global.__mockTransactions[sellerId] ? global.__mockTransactions[sellerId] : [];
}
module.exports = { evaluateSellerTrust };
