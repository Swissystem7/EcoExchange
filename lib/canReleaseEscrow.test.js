const assert = require('node:assert');
const { canReleaseEscrow } = require('./canReleaseEscrow.js');

// Normal case: both confirmed
assert.deepStrictEqual(
  canReleaseEscrow({ buyerConfirmed: true, sellerConfirmed: true, disputeRaised: false, disputeResolved: null, escrowAgeHours: 10, autoReleaseHours: 72 }),
  { release: true, reason: 'Both parties confirmed' }
);

// Normal case: auto-release buyer confirmed
assert.deepStrictEqual(
  canReleaseEscrow({ buyerConfirmed: true, sellerConfirmed: false, disputeRaised: false, disputeResolved: null, escrowAgeHours: 80, autoReleaseHours: 72 }),
  { release: true, reason: 'Auto-release after timeout (buyer confirmed)' }
);

// Normal case: auto-release seller only (extended timeout)
assert.deepStrictEqual(
  canReleaseEscrow({ buyerConfirmed: false, sellerConfirmed: true, disputeRaised: false, disputeResolved: null, escrowAgeHours: 150, autoReleaseHours: 72 }),
  { release: true, reason: 'Auto-release after extended timeout (seller only)' }
);

// Edge case: dispute raised and unresolved
assert.deepStrictEqual(
  canReleaseEscrow({ buyerConfirmed: true, sellerConfirmed: true, disputeRaised: true, disputeResolved: false, escrowAgeHours: 10, autoReleaseHours: 72 }),
  { release: false, reason: 'Dispute unresolved' }
);

// Edge case: dispute raised and resolved
assert.deepStrictEqual(
  canReleaseEscrow({ buyerConfirmed: false, sellerConfirmed: false, disputeRaised: true, disputeResolved: true, escrowAgeHours: 10, autoReleaseHours: 72 }),
  { release: true, reason: 'Dispute resolved in buyer favor' }
);

// Edge case: pending confirmation
assert.deepStrictEqual(
  canReleaseEscrow({ buyerConfirmed: false, sellerConfirmed: false, disputeRaised: false, disputeResolved: null, escrowAgeHours: 10, autoReleaseHours: 72 }),
  { release: false, reason: 'Pending confirmation' }
);

// Edge case: negative escrowAgeHours defaults to 0
assert.deepStrictEqual(
  canReleaseEscrow({ buyerConfirmed: true, sellerConfirmed: false, disputeRaised: false, disputeResolved: null, escrowAgeHours: -5, autoReleaseHours: 72 }),
  { release: false, reason: 'Pending confirmation' }
);

// Edge case: non-numeric autoReleaseHours defaults to 72
assert.deepStrictEqual(
  canReleaseEscrow({ buyerConfirmed: true, sellerConfirmed: false, disputeRaised: false, disputeResolved: null, escrowAgeHours: 80, autoReleaseHours: 'abc' }),
  { release: true, reason: 'Auto-release after timeout (buyer confirmed)' }
);

// Edge case: non-boolean disputeResolved defaults to null
assert.deepStrictEqual(
  canReleaseEscrow({ buyerConfirmed: false, sellerConfirmed: false, disputeRaised: true, disputeResolved: 'yes', escrowAgeHours: 10, autoReleaseHours: 72 }),
  { release: false, reason: 'Dispute unresolved' }
);

// Edge case: dispute raised but disputeResolved is null (treated as unresolved, dispute takes precedence)
assert.deepStrictEqual(
  canReleaseEscrow({ buyerConfirmed: true, sellerConfirmed: true, disputeRaised: true, disputeResolved: null, escrowAgeHours: 10, autoReleaseHours: 72 }),
  { release: false, reason: 'Dispute unresolved' }
);

// Edge case: negative autoReleaseHours defaults to 72 (buyer confirmed, age below default => pending)
assert.deepStrictEqual(
  canReleaseEscrow({ buyerConfirmed: true, sellerConfirmed: false, disputeRaised: false, disputeResolved: null, escrowAgeHours: 50, autoReleaseHours: -10 }),
  { release: false, reason: 'Pending confirmation' }
);

console.log('ok');
