'use strict';

const assert = require('node:assert');
const { commission } = require('./commission.js');

// Normal case: mid tier (7%)
assert.deepStrictEqual(commission(2000), { rate: 0.07, fee: 140, sellerNet: 1860 });

// Tier 1: <=1000 -> 10%
assert.deepStrictEqual(commission(1000), { rate: 0.10, fee: 100, sellerNet: 900 });
assert.deepStrictEqual(commission(0.01), { rate: 0.10, fee: 0, sellerNet: 0.01 });

// Tier 2 boundary: <=10000 -> 7%
assert.deepStrictEqual(commission(10000), { rate: 0.07, fee: 700, sellerNet: 9300 });
assert.deepStrictEqual(commission(1000.01), { rate: 0.07, fee: 70, sellerNet: 930.01 });

// Tier 3: >10000 -> 5%
assert.deepStrictEqual(commission(10000.01), { rate: 0.05, fee: 500, sellerNet: 9500.01 });
assert.deepStrictEqual(commission(20000), { rate: 0.05, fee: 1000, sellerNet: 19000 });

// Rounding to 2 decimals
assert.deepStrictEqual(commission(999.99), { rate: 0.10, fee: 100, sellerNet: 899.99 });
assert.deepStrictEqual(commission(333.33), { rate: 0.10, fee: 33.33, sellerNet: 300 });

// Edge case: non-positive -> null
assert.strictEqual(commission(0), null);
assert.strictEqual(commission(-5), null);

// Edge case: invalid inputs -> null
assert.strictEqual(commission(NaN), null);
assert.strictEqual(commission(Infinity), null);
assert.strictEqual(commission('100'), null);
assert.strictEqual(commission(undefined), null);

console.log('all tests passed');
