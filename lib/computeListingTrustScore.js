function computeListingTrustScore(listing) {
  const sellerVerificationLevel = Math.max(0, Math.min(3, listing.sellerVerificationLevel ?? 0));
  const condition = listing.condition ?? '';
  const descriptionLength = Math.max(0, listing.descriptionLength ?? 0);
  const imagesCount = Math.max(0, listing.imagesCount ?? 0);
  const hasSerialNumber = listing.hasSerialNumber === true;
  const hasSpecSheet = listing.hasSpecSheet === true;

  const conditionScore = {'New':30,'Used-Like New':25,'Used-Good':20,'Used-Fair':15,'Used-Poor':10}[condition] || 0;
  const descriptionScore = descriptionLength >= 100 ? 20 : descriptionLength >= 50 ? 10 : 0;
  const imagesScore = imagesCount >= 5 ? 20 : imagesCount >= 3 ? 15 : imagesCount >= 1 ? 10 : 0;
  const serialScore = hasSerialNumber ? 10 : 0;
  const specSheetScore = hasSpecSheet ? 10 : 0;
  const verificationScore = sellerVerificationLevel * 10;

  const total = Math.min(100, conditionScore + descriptionScore + imagesScore + serialScore + specSheetScore + verificationScore);

  return {
    score: total,
    maxScore: 100,
    details: {
      conditionScore,
      descriptionScore,
      imagesScore,
      serialScore,
      specSheetScore,
      verificationScore
    }
  };
}

module.exports = { computeListingTrustScore };
