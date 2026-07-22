function computeVerificationScore(sellerProfile, listingData, inspectionReport) {
  if (!sellerProfile || !listingData) return 0;
  let score = 0;
  if (inspectionReport && inspectionReport.hasReport && Number.isFinite(inspectionReport.reportScore)) {
    score += Math.min(50, Math.max(0, Math.floor(inspectionReport.reportScore * 0.5)));
    let listingScore = 0;
    if (listingData.condition !== 'fair' && listingData.condition !== 'poor') listingScore += 5;
    if (listingData.photosCount >= 5) listingScore += 10;
    if (listingData.hasInspectionReport) listingScore += 15;
    if (listingData.serialNumber) listingScore += 10;
    if (listingData.description && listingData.description.length > 100) listingScore += 10;
    score += Math.min(50, listingScore);
  } else {
    let sellerScore = 0;
    const sales = Number.isFinite(sellerProfile.completedSales) ? Math.max(0, sellerProfile.completedSales) : 0;
    const rating = Number.isFinite(sellerProfile.avgRating) ? Math.min(5, Math.max(0, sellerProfile.avgRating)) : 0;
    const age = Number.isFinite(sellerProfile.accountAgeDays) ? Math.max(0, sellerProfile.accountAgeDays) : 0;
    sellerScore = Math.min(50, Math.floor(Math.min(sales, 20) + rating * 4 + Math.min(age / 36.5, 10)));
    if (!(sales > 10 && rating > 4.5 && age > 365)) sellerScore = Math.min(29, sellerScore);
    if (sales === 0 && age < 30) {
      sellerScore = Math.min(10, sellerScore);
    }
    score += Math.min(50, sellerScore);
    let listingScore = 0;
    if (listingData.condition !== 'fair' && listingData.condition !== 'poor') listingScore += 5;
    if (listingData.photosCount >= 5) listingScore += 10;
    if (listingData.hasInspectionReport) listingScore += 15;
    if (listingData.serialNumber) listingScore += 10;
    if (listingData.description && listingData.description.length > 100) listingScore += 10;
    score += Math.min(50, listingScore);
  }
  if (listingData.condition === 'new') score += 10;
  if (score > 100) score = 100;
  if (score < 0) score = 0;
  return Math.round(score);
}
module.exports = { computeVerificationScore };
