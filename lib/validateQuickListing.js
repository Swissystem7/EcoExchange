function validateQuickListing(listingData) {
  listingData = listingData && typeof listingData === 'object' ? listingData : {};
  const errors = [];
  const suggestions = [];
  const currentYear = new Date().getFullYear();

  if (typeof listingData.title !== 'string' || listingData.title.trim() === '') {
    errors.push('Title required');
  }

  if (listingData.price !== undefined && (!Number.isFinite(listingData.price) || listingData.price < 0)) {
    errors.push('Price must be positive');
  }

  if (listingData.year !== undefined && (!Number.isFinite(listingData.year) || listingData.year > currentYear)) {
    errors.push('Year cannot be in the future');
  }

  if (listingData.category === 'heavy_equipment' && (listingData.hours === undefined || listingData.hours === null)) {
    suggestions.push('Add operating hours for better buyer trust');
  }

  if (!listingData.images || listingData.images.length === 0) {
    suggestions.push('Add at least one image to increase listing visibility');
  }

  return {
    valid: errors.length === 0,
    errors,
    suggestions
  };
}

module.exports = { validateQuickListing };
