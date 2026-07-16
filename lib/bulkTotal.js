'use strict';

function bulkTotal(qty, unitPrice) {
  if (!(qty > 0) || !(unitPrice > 0)) return null;
  const rate = qty >= 100 ? 0.15 : qty >= 20 ? 0.08 : 0;
  return Math.round(qty * unitPrice * (1 - rate) * 100) / 100;
}

module.exports = { bulkTotal };
