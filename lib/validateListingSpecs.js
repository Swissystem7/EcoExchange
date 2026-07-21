function validateListingSpecs(listing, knownModels) {
  const mismatches = [];
  if (!listing || typeof listing !== 'object') {
    return { isValid: false, mismatches: ['Missing required field'] };
  }
  const { title, description, category, make, model, year, condition } = listing;
  if (![title, description, category, make, model, year, condition].every(value => value !== undefined && value !== null && value !== '')) {
    mismatches.push('Missing required field');
    return { isValid: false, mismatches };
  }
  if (!knownModels || knownModels.length === 0) {
    return { isValid: true, mismatches: [] };
  }
  const yearNum = parseInt(year, 10);
  const matchingModels = knownModels.filter(m => m.make === make && m.model === model);
  if (matchingModels.length === 0) {
    if (!knownModels.some(m => m.category === category)) {
      mismatches.push('Unknown category');
    }
    return { isValid: mismatches.length === 0, mismatches };
  }
  if (!knownModels.some(m => m.category === category)) {
    mismatches.push('Unknown category');
  }
  for (const m of matchingModels) {
    if (yearNum < m.yearMin || yearNum > m.yearMax) {
      mismatches.push(`Year ${yearNum} not in range ${m.yearMin}-${m.yearMax} for Model ${m.model}`);
    }
  }
  return { isValid: mismatches.length === 0, mismatches };
}
module.exports = { validateListingSpecs };
