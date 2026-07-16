'use strict';

// listingScore(listing) -> 0..100
// listing: { title, description, photos:array, priceIls }
function listingScore(listing) {
  const l = listing || {};
  const title = typeof l.title === 'string' ? l.title : '';
  const description = typeof l.description === 'string' ? l.description : '';
  const photos = Array.isArray(l.photos) ? l.photos : [];
  const priceIls = typeof l.priceIls === 'number' ? l.priceIls : 0;

  let score = 0;
  if (title.length >= 10) score += 30;
  if (description.length >= 50) score += 30;
  if (photos.length >= 3) score += 20;
  else if (photos.length >= 1) score += 10;
  if (priceIls > 0) score += 20;
  return score;
}

module.exports = { listingScore };
