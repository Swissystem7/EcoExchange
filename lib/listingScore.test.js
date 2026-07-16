'use strict';

const assert = require('node:assert');
const { listingScore } = require('./listingScore.js');

// Normal case: everything qualifies -> 100
assert.strictEqual(
  listingScore({
    title: 'Vintage wooden chair',
    description: 'Solid oak dining chair in great condition, barely used over the years.',
    photos: ['a', 'b', 'c'],
    priceIls: 120,
  }),
  100
);

// title edge: exactly 10 chars qualifies (+30), just title
assert.strictEqual(listingScore({ title: '1234567890', description: '', photos: [], priceIls: 0 }), 30);
// title just under 10 -> no title points
assert.strictEqual(listingScore({ title: '123456789', description: '', photos: [], priceIls: 0 }), 0);

// description edge: exactly 50 chars qualifies (+30)
assert.strictEqual(listingScore({ title: '', description: 'x'.repeat(50), photos: [], priceIls: 0 }), 30);
// description just under 50 -> no points
assert.strictEqual(listingScore({ title: '', description: 'x'.repeat(49), photos: [], priceIls: 0 }), 0);

// photos edge: 0 -> +0, 1 -> +10, 2 -> +10, 3 -> +20, 4 -> +20
assert.strictEqual(listingScore({ photos: [] }), 0);
assert.strictEqual(listingScore({ photos: ['a'] }), 10);
assert.strictEqual(listingScore({ photos: ['a', 'b'] }), 10);
assert.strictEqual(listingScore({ photos: ['a', 'b', 'c'] }), 20);
assert.strictEqual(listingScore({ photos: ['a', 'b', 'c', 'd'] }), 20);

// priceIls edge: >0 qualifies, 0 and negative do not
assert.strictEqual(listingScore({ priceIls: 1 }), 20);
assert.strictEqual(listingScore({ priceIls: 0 }), 0);
assert.strictEqual(listingScore({ priceIls: -5 }), 0);

// defensive: missing/undefined listing and fields must not throw
assert.strictEqual(listingScore(), 0);
assert.strictEqual(listingScore({}), 0);
assert.strictEqual(listingScore({ title: null, description: null, photos: null, priceIls: null }), 0);

console.log('all tests passed');
