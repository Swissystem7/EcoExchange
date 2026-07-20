const crypto = require('crypto');

function verifyListingSignature(listingData, signature, publicKey) {
  if (typeof publicKey !== 'string' || !publicKey.includes('-----BEGIN PUBLIC KEY-----')) {
    throw new TypeError('Invalid public key format');
  }
  if (!listingData || Object.keys(listingData).length === 0) {
    return { valid: false, reason: 'empty data' };
  }
  const requiredFields = ['serialNumber', 'manufacturer', 'model', 'year', 'condition', 'timestamp'];
  for (const field of requiredFields) {
    if (!(field in listingData) || listingData[field] === undefined || listingData[field] === null) {
      return { valid: false, reason: `missing field: ${field}` };
    }
  }
  const now = Date.now();
  const ts = new Date(listingData.timestamp).getTime();
  if (isNaN(ts) || now - ts > 24 * 60 * 60 * 1000) {
    return { valid: false, reason: 'timestamp expired' };
  }
  const dataString = JSON.stringify(listingData, Object.keys(listingData).sort());
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(dataString);
  verifier.end();
  const isValid = verifier.verify(publicKey, Buffer.from(signature, 'base64'));
  if (!isValid) {
    return { valid: false, reason: 'signature mismatch' };
  }
  return { valid: true, reason: '' };
}

module.exports = { verifyListingSignature };