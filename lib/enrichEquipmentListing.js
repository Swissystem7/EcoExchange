const db = {
  "CAT-320D": { manufacturer: "Caterpillar", weight: "20000 kg", dimensions: "9.4m x 2.8m x 3.0m", enginePower: "140 hp", year: 2015, category: "Excavator" },
  "CAT-320E": { manufacturer: "Caterpillar", weight: "21000 kg", dimensions: "9.5m x 2.9m x 3.1m", enginePower: "145 hp", year: 2018, category: "Excavator" },
  "KOM-PC200-8": { manufacturer: "Komatsu", weight: "19800 kg", dimensions: "9.2m x 2.7m x 2.9m", enginePower: "138 hp", year: 2016, category: "Excavator" },
  "KOM-PC200-10": { manufacturer: "Komatsu", weight: "20500 kg", dimensions: "9.3m x 2.8m x 3.0m", enginePower: "142 hp", year: 2020, category: "Excavator" },
  "JCB-3CX": { manufacturer: "JCB", weight: "7500 kg", dimensions: "5.6m x 2.3m x 2.8m", enginePower: "92 hp", year: 2017, category: "Backhoe Loader" },
  "JCB-4CX": { manufacturer: "JCB", weight: "8200 kg", dimensions: "5.8m x 2.4m x 2.9m", enginePower: "98 hp", year: 2019, category: "Backhoe Loader" }
};

async function enrichEquipmentListing(partialListing) {
  if (!partialListing || typeof partialListing.modelNumber !== 'string' ||
      !partialListing.modelNumber.trim() || typeof partialListing.manufacturer !== 'string' ||
      !partialListing.manufacturer.trim()) {
    throw new Error("Missing required fields: modelNumber and manufacturer are mandatory");
  }

  const { modelNumber, manufacturer, year, category } = partialListing;
  const normalizedModel = modelNumber.trim().toUpperCase();
  const normalizedManufacturer = manufacturer.trim().toLowerCase();

  const exactMatch = db[normalizedModel];
  if (exactMatch && exactMatch.manufacturer.toLowerCase() === normalizedManufacturer) {
    const enrichedFields = {
      weight: exactMatch.weight,
      dimensions: exactMatch.dimensions,
      enginePower: exactMatch.enginePower,
      year: exactMatch.year,
      category: exactMatch.category
    };
    if (year) enrichedFields.year = year;
    if (category) enrichedFields.category = category;
    return { enrichedFields, confidence: 1, suggestions: [] };
  }

  const allEntries = Object.entries(db);
  const ambiguousMatches = allEntries.filter(([key, val]) => {
    const keyNorm = key.toUpperCase();
    const manuMatch = val.manufacturer.toLowerCase() === normalizedManufacturer;
    const modelPartial = keyNorm.includes(normalizedModel) || normalizedModel.includes(keyNorm);
    return manuMatch && modelPartial;
  });

  if (ambiguousMatches.length === 0) {
    return {
      enrichedFields: {},
      confidence: 0,
      suggestions: ["No exact match; try different model number"]
    };
  }

  const bestMatch = ambiguousMatches[0][1];
  const bestKey = ambiguousMatches[0][0];
  const enrichedFields = {
    weight: bestMatch.weight,
    dimensions: bestMatch.dimensions,
    enginePower: bestMatch.enginePower,
    year: bestMatch.year,
    category: bestMatch.category
  };
  if (year) enrichedFields.year = year;
  if (category) enrichedFields.category = category;

  const suggestions = ambiguousMatches.map(([key]) => `Possible match: ${key}`);
  const confidence = Math.min(0.99, 1 / ambiguousMatches.length);

  return { enrichedFields, confidence, suggestions };
}

module.exports = { enrichEquipmentListing };
