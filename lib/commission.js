'use strict';

// EcoExchange commission tiers (ILS):
//   amount <= 1000  -> 10%
//   amount <= 10000 -> 7%
//   amount > 10000  -> 5%
// Non-positive amount (or non-finite) -> null.
function commission(amountIls) {
  if (typeof amountIls !== 'number' || !Number.isFinite(amountIls) || amountIls <= 0) {
    return null;
  }
  const rate = amountIls <= 1000 ? 0.10 : amountIls <= 10000 ? 0.07 : 0.05;
  const fee = Math.round(amountIls * rate * 100) / 100;
  const sellerNet = Math.round((amountIls - fee) * 100) / 100;
  return { rate, fee, sellerNet };
}

module.exports = { commission };
