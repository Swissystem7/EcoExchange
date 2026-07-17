const assert = require('node:assert');
const { computeListingTrustScore } = require('./computeListingTrustScore.js');

// Normal case: high trust listing (would be 120 -> capped at 100)
const result1 = computeListingTrustScore({
  sellerVerificationLevel: 3,
  condition: 'New',
  descriptionLength: 150,
  imagesCount: 5,
  hasSerialNumber: true,
  hasSpecSheet: true
});
assert.strictEqual(result1.score, 100);
assert.strictEqual(result1.maxScore, 100);
assert.deepStrictEqual(result1.details, {
  conditionScore: 30,
  descriptionScore: 20,
  imagesScore: 20,
  serialScore: 10,
  specSheetScore: 10,
  verificationScore: 30
});

// Normal case: medium trust listing
// 20 + 10 + 15 + 0 + 10 + 10 = 65
const result2 = computeListingTrustScore({
  sellerVerificationLevel: 1,
  condition: 'Used-Good',
  descriptionLength: 75,
  imagesCount: 3,
  hasSerialNumber: false,
  hasSpecSheet: true
});
assert.strictEqual(result2.score, 65);
assert.strictEqual(result2.maxScore, 100);
assert.deepStrictEqual(result2.details, {
  conditionScore: 20,
  descriptionScore: 10,
  imagesScore: 15,
  serialScore: 0,
  specSheetScore: 10,
  verificationScore: 10
});

// Edge case: missing all fields (undefined/null)
const result3 = computeListingTrustScore({});
assert.strictEqual(result3.score, 0);
assert.strictEqual(result3.maxScore, 100);
assert.deepStrictEqual(result3.details, {
  conditionScore: 0,
  descriptionScore: 0,
  imagesScore: 0,
  serialScore: 0,
  specSheetScore: 0,
  verificationScore: 0
});

// Edge case: negative values -> clamped/zeroed
const result4 = computeListingTrustScore({
  sellerVerificationLevel: -5,
  condition: 'Unknown',
  descriptionLength: -10,
  imagesCount: -1,
  hasSerialNumber: false,
  hasSpecSheet: false
});
assert.strictEqual(result4.score, 0);
assert.strictEqual(result4.maxScore, 100);
assert.deepStrictEqual(result4.details, {
  conditionScore: 0,
  descriptionScore: 0,
  imagesScore: 0,
  serialScore: 0,
  specSheetScore: 0,
  verificationScore: 0
});

// Edge case: values above max -> verification clamped to 3, total capped at 100
const result5 = computeListingTrustScore({
  sellerVerificationLevel: 10,
  condition: 'New',
  descriptionLength: 500,
  imagesCount: 100,
  hasSerialNumber: true,
  hasSpecSheet: true
});
assert.strictEqual(result5.score, 100);
assert.strictEqual(result5.maxScore, 100);
assert.deepStrictEqual(result5.details, {
  conditionScore: 30,
  descriptionScore: 20,
  imagesScore: 20,
  serialScore: 10,
  specSheetScore: 10,
  verificationScore: 30
});

// Boundary description lengths: <50 -> 0, [50,100) -> 10, >=100 -> 20
assert.strictEqual(computeListingTrustScore({ descriptionLength: 49 }).details.descriptionScore, 0);
assert.strictEqual(computeListingTrustScore({ descriptionLength: 50 }).details.descriptionScore, 10);
assert.strictEqual(computeListingTrustScore({ descriptionLength: 99 }).details.descriptionScore, 10);
assert.strictEqual(computeListingTrustScore({ descriptionLength: 100 }).details.descriptionScore, 20);

// Boundary images counts: 0 -> 0, [1,3) -> 10, [3,5) -> 15, >=5 -> 20
assert.strictEqual(computeListingTrustScore({ imagesCount: 0 }).details.imagesScore, 0);
assert.strictEqual(computeListingTrustScore({ imagesCount: 1 }).details.imagesScore, 10);
assert.strictEqual(computeListingTrustScore({ imagesCount: 2 }).details.imagesScore, 10);
assert.strictEqual(computeListingTrustScore({ imagesCount: 3 }).details.imagesScore, 15);
assert.strictEqual(computeListingTrustScore({ imagesCount: 4 }).details.imagesScore, 15);
assert.strictEqual(computeListingTrustScore({ imagesCount: 5 }).details.imagesScore, 20);

// All condition values -> mapped score, unknown/empty -> 0
const conditions = ['New', 'Used-Like New', 'Used-Good', 'Used-Fair', 'Used-Poor', '', 'SomeOther'];
const expectedScores = [30, 25, 20, 15, 10, 0, 0];
conditions.forEach((condition, idx) => {
  assert.strictEqual(computeListingTrustScore({ condition }).details.conditionScore, expectedScores[idx]);
});

// Serial/spec flags only count when strictly boolean true
const result16 = computeListingTrustScore({ hasSerialNumber: 'true', hasSpecSheet: 1 });
assert.strictEqual(result16.details.serialScore, 0);
assert.strictEqual(result16.details.specSheetScore, 0);

const result17 = computeListingTrustScore({ hasSerialNumber: true, hasSpecSheet: true });
assert.strictEqual(result17.details.serialScore, 10);
assert.strictEqual(result17.details.specSheetScore, 10);

// verificationScore = clampedLevel * 10
assert.strictEqual(computeListingTrustScore({ sellerVerificationLevel: 2 }).details.verificationScore, 20);
assert.strictEqual(computeListingTrustScore({ sellerVerificationLevel: 3 }).details.verificationScore, 30);

console.log('ok');
