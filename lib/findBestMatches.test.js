const assert = require('node:assert');
const { findBestMatches } = require('./findBestMatches.js');

// Normal case
const result1 = findBestMatches(
  { category: 'electronics', keywords: 'laptop', maxPrice: 1000, minCondition: 'Used-Good' },
  [
    { listingId: 1, category: 'electronics', title: 'Laptop', description: 'good laptop', price: 800, condition: 'New', sellerRating: 4.5 },
    { listingId: 2, category: 'electronics', title: 'Phone', description: 'phone', price: 500, condition: 'Used-Good', sellerRating: 3 }
  ]
);
assert.strictEqual(result1.matches.length, 2);
assert.strictEqual(result1.matches[0].listingId, 1);
assert.strictEqual(result1.matches[0].relevanceScore > 0, true);
assert.strictEqual(result1.matches[1].listingId, 2);
// relevanceScore stays within [0,1]
assert.ok(result1.matches.every(m => m.relevanceScore >= 0 && m.relevanceScore <= 1));

// Edge case: empty listings
const result2 = findBestMatches({}, []);
assert.strictEqual(result2.matches.length, 0);

// Edge case: null/undefined listings
const result3 = findBestMatches({}, [null, undefined, { listingId: 1, price: 100 }]);
assert.strictEqual(result3.matches.length, 1);
assert.strictEqual(result3.matches[0].listingId, 1);

// Edge case: duplicate listingId -> keep first occurrence only
const result4 = findBestMatches({}, [
  { listingId: 1, price: 100 },
  { listingId: 1, price: 200 }
]);
assert.strictEqual(result4.matches.length, 1);

// Edge case: missing listingId
const result5 = findBestMatches({}, [{ price: 100 }, { listingId: 2, price: 200 }]);
assert.strictEqual(result5.matches.length, 1);
assert.strictEqual(result5.matches[0].listingId, 2);

// Edge case: negative price -> skip (spec: "Negative price -> skip listing")
const result6 = findBestMatches({}, [{ listingId: 1, price: -10 }]);
assert.strictEqual(result6.matches.length, 0);

// Edge case: price exceeds maxPrice
const result7 = findBestMatches({ maxPrice: 100 }, [{ listingId: 1, price: 150 }]);
assert.strictEqual(result7.matches.length, 0);

// Edge case: condition below minCondition
const result8 = findBestMatches({ minCondition: 'New' }, [{ listingId: 1, condition: 'Used-Good', price: 100 }]);
assert.strictEqual(result8.matches.length, 0);

// Edge case: invalid condition defaults to Used-Poor rank
const result9 = findBestMatches({}, [{ listingId: 1, condition: 'Unknown', price: 100 }]);
assert.strictEqual(result9.matches.length, 1);

// Edge case: non-numeric price -> skip
const result10 = findBestMatches({ maxPrice: 100 }, [{ listingId: 1, price: 'free' }]);
assert.strictEqual(result10.matches.length, 0);

// Edge case: NaN price -> skip
const result11 = findBestMatches({}, [{ listingId: 1, price: NaN }]);
assert.strictEqual(result11.matches.length, 0);

// Edge case: sellerRating out of range -> clamp to 0-5
const result12 = findBestMatches({}, [{ listingId: 1, price: 100, sellerRating: 10 }]);
assert.strictEqual(result12.matches.length, 1);
assert.strictEqual(result12.matches[0].relevanceScore > 0, true);
// rating clamped to 5 => ratingWeight capped at 0.1
assert.ok(result12.matches[0].relevanceScore <= 0.1 + 1e-9);

// Edge case: negative sellerRating -> clamp to 0
const result13 = findBestMatches({}, [{ listingId: 1, price: 100, sellerRating: -5 }]);
assert.strictEqual(result13.matches.length, 1);
assert.strictEqual(result13.matches[0].relevanceScore, 0);

// Edge case: empty keywords -> keywordWeight 0, listing still kept
const result14 = findBestMatches({ keywords: '' }, [{ listingId: 1, title: 'test', price: 100 }]);
assert.strictEqual(result14.matches.length, 1);

// Edge case: no category match -> kept, no category weight
const result15 = findBestMatches({ category: 'books' }, [{ listingId: 1, category: 'electronics', price: 100 }]);
assert.strictEqual(result15.matches.length, 1);

// Edge case: maxPrice is 0, price 0 -> not > maxPrice, kept
const result16 = findBestMatches({ maxPrice: 0 }, [{ listingId: 1, price: 0 }]);
assert.strictEqual(result16.matches.length, 1);

// Edge case: maxPrice negative -> everything exceeds it
const result17 = findBestMatches({ maxPrice: -10 }, [{ listingId: 1, price: 5 }]);
assert.strictEqual(result17.matches.length, 0);

// Edge case: invalid minCondition -> defaults minRank 1
const result18 = findBestMatches({ minCondition: 'Invalid' }, [{ listingId: 1, condition: 'New', price: 100 }]);
assert.strictEqual(result18.matches.length, 1);

// Edge case: listing missing price entirely -> kept (no price constraint)
const result19 = findBestMatches({}, [{ listingId: 1 }]);
assert.strictEqual(result19.matches.length, 1);

// Edge case: sorting by relevanceScore descending
const result20 = findBestMatches({ category: 'a', keywords: 'test' }, [
  { listingId: 1, category: 'a', title: 'test', price: 50, condition: 'New', sellerRating: 5 },
  { listingId: 2, category: 'b', title: 'other', price: 100, condition: 'Used-Poor', sellerRating: 1 }
]);
assert.strictEqual(result20.matches[0].listingId, 1);
assert.strictEqual(result20.matches[1].listingId, 2);
assert.ok(result20.matches[0].relevanceScore >= result20.matches[1].relevanceScore);

// Keyword partial match: half the query words matched -> half of 0.4 weight
const result21 = findBestMatches(
  { keywords: 'red bike' },
  [{ listingId: 1, title: 'red scooter', price: 100 }]
);
assert.strictEqual(result21.matches.length, 1);
assert.ok(Math.abs(result21.matches[0].relevanceScore - 0.2) < 1e-9);

console.log('ok');