function verifyImageUniqueness(imageHash, databaseHashes) {
  if (typeof imageHash !== 'string' || !/^[0-9a-f]{64}$/i.test(imageHash)) {
    return { isUnique: false, duplicates: [], confidence: 0 };
  }
  if (!Array.isArray(databaseHashes) || databaseHashes.length === 0) {
    return { isUnique: true, duplicates: [], confidence: 1 };
  }
  const duplicates = [];
  for (const hash of databaseHashes) {
    if (typeof hash === 'string' && /^[0-9a-f]{64}$/i.test(hash)) {
      let diff = 0;
      for (let i = 0; i < 64; i++) {
        let bits = parseInt(imageHash[i], 16) ^ parseInt(hash[i], 16);
        while (bits) { diff += bits & 1; bits >>>= 1; }
      }
      const similarity = 1 - diff / 256;
      if (similarity > 0.9) {
        duplicates.push(hash);
      }
    }
  }
  const isUnique = duplicates.length === 0;
  const confidence = isUnique ? 1 : 0;
  return { isUnique, duplicates, confidence };
}
module.exports = { verifyImageUniqueness };
