function computeRetentionAction(userId, userRole) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)) return null;
  if (userRole !== 'buyer' && userRole !== 'seller') return null;
  const activityLogs = getUserActivityLogs(userId);
  if (!activityLogs) {
    return userRole === 'buyer'
      ? { churnRisk: 'high', recommendedAction: 'send_saved_search_alert', actionPayload: { searchQuery: '' } }
      : { churnRisk: 'high', recommendedAction: 'send_listing_booster_discount', actionPayload: { discountPercent: 10 } };
  }
  const now = Date.now();
  const msPerDay = 86400000;
  const lastLogin = activityLogs.lastLogin ? (now - new Date(activityLogs.lastLogin).getTime()) / msPerDay : Infinity;
  const lastTransaction = activityLogs.lastTransaction ? (now - new Date(activityLogs.lastTransaction).getTime()) / msPerDay : Infinity;
  const loginGap = Math.floor(lastLogin);
  const transactionGap = Math.floor(lastTransaction);
  let churnRisk;
  if (loginGap > 30 && transactionGap > 60) {
    churnRisk = 'high';
  } else if (loginGap > 30 || transactionGap > 60) {
    churnRisk = 'medium';
  } else {
    churnRisk = 'low';
  }
  const lastActionDate = activityLogs.lastActionDate ? new Date(activityLogs.lastActionDate).getTime() : null;
  if (lastActionDate && (now - lastActionDate) < 7 * msPerDay) {
    return null;
  }
  let recommendedAction, actionPayload;
  if (userRole === 'buyer') {
    recommendedAction = 'send_saved_search_alert';
    actionPayload = { searchQuery: activityLogs.savedSearch || '' };
  } else if (userRole === 'seller') {
    recommendedAction = 'send_listing_booster_discount';
    actionPayload = { discountPercent: 10 };
  } else {
    return null;
  }
  return { churnRisk, recommendedAction, actionPayload };
}
function getUserActivityLogs(userId) {
  if (globalThis.__userActivityLogs) return globalThis.__userActivityLogs[userId] || null;
  const mockLogs = {
    'user-1': { lastLogin: '2025-03-01', lastTransaction: '2025-02-01', savedSearch: 'vintage watches', lastActionDate: null },
    'user-2': { lastLogin: '2025-03-20', lastTransaction: '2025-03-15', listingViews: 5, lastActionDate: '2025-03-25' },
    'user-3': { lastLogin: '2025-01-10', lastTransaction: '2024-12-01', savedSearch: 'antique furniture', lastActionDate: null },
    'user-4': { lastLogin: '2025-03-28', lastTransaction: '2025-03-28', listingViews: 2, lastActionDate: '2025-03-22' },
  };
  return mockLogs[userId] || null;
}
module.exports = { computeRetentionAction };
