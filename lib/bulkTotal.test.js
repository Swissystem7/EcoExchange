'use strict';

const assert = require('node:assert');
const { bulkTotal } = require('./bulkTotal.js');

// no discount (qty < 20)
assert.strictEqual(bulkTotal(10, 5), 50);
// 8% tier (qty >= 20)
assert.strictEqual(bulkTotal(20, 10), 184); // 200 * 0.92
// 15% tier (qty >= 100)
assert.strictEqual(bulkTotal(100, 10), 850); // 1000 * 0.85
// boundary just below 20 -> no discount
assert.strictEqual(bulkTotal(19, 10), 190);
// boundary just below 100 -> 8%
assert.strictEqual(bulkTotal(99, 10), 910.8); // 990 * 0.92
// rounding to 2 decimals (no-discount path)
assert.strictEqual(bulkTotal(3, 33.336), 100.01); // 100.008 -> 100.01
// rounding to 2 decimals (through discount path)
assert.strictEqual(bulkTotal(20, 12.345), 227.15); // 246.9 * 0.92 = 227.148 -> 227.15

// edge cases -> null
assert.strictEqual(bulkTotal(0, 10), null);
assert.strictEqual(bulkTotal(-5, 10), null);
assert.strictEqual(bulkTotal(10, 0), null);
assert.strictEqual(bulkTotal(10, -2), null);
assert.strictEqual(bulkTotal(NaN, 10), null);
assert.strictEqual(bulkTotal(10, NaN), null);

console.log('all tests passed');
