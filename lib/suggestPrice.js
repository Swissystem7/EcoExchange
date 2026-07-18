function suggestPrice(equipmentType, condition, marketTrends) {
  const validEquipmentTypes = ['excavator','compressor','generator','forklift','crane'];
  const validConditions = ['as-is','fair','good','excellent','refurbished'];

  if (!validEquipmentTypes.includes(equipmentType)) {
    throw new Error('Invalid equipmentType');
  }
  if (!validConditions.includes(condition)) {
    throw new Error('Invalid condition');
  }
  if (typeof marketTrends !== 'object' || marketTrends === null) {
    throw new Error('marketTrends must be an object');
  }
  const { demandIndex, recentAvgPrice, supplyCount, seasonFactor } = marketTrends;
  if (typeof demandIndex !== 'number' || isNaN(demandIndex) || !isFinite(demandIndex) || demandIndex < 0 || demandIndex > 100) {
    throw new Error('Invalid demandIndex');
  }
  if (!Number.isFinite(recentAvgPrice) || recentAvgPrice <= 0) {
    throw new Error('Invalid recentAvgPrice');
  }
  if (!Number.isInteger(supplyCount) || supplyCount < 0) {
    throw new Error('Invalid supplyCount');
  }
  if (typeof seasonFactor !== 'number' || isNaN(seasonFactor) || !isFinite(seasonFactor) || seasonFactor < 0.5 || seasonFactor > 1.5) {
    throw new Error('Invalid seasonFactor');
  }

  let basePrice = recentAvgPrice;
  if (supplyCount === 0) {
    basePrice = recentAvgPrice * 1.2;
  }

  if (demandIndex < 20) {
    basePrice = basePrice * 0.85;
  } else if (demandIndex > 80) {
    basePrice = basePrice * 1.1;
  }

  let suggestedMinPrice = basePrice * 0.9;
  let suggestedMaxPrice = basePrice * 1.1;

  if (seasonFactor < 0.8) {
    suggestedMinPrice = suggestedMinPrice * 0.9;
    suggestedMaxPrice = suggestedMaxPrice * 0.9;
  }

  const conditionMultipliers = {
    'as-is': 0.7,
    'fair': 0.85,
    'good': 1.0,
    'excellent': 1.15,
    'refurbished': 1.05
  };
  const conditionMultiplier = conditionMultipliers[condition];
  suggestedMinPrice = suggestedMinPrice * conditionMultiplier;
  suggestedMaxPrice = suggestedMaxPrice * conditionMultiplier;

  let confidence;
  if (demandIndex < 20 || demandIndex > 80) {
    confidence = 0.7;
  } else if (supplyCount === 0) {
    confidence = 0.5;
  } else {
    confidence = 0.85;
  }

  const reasoning = `Based on ${equipmentType} in ${condition} condition with demand index ${demandIndex}, average price ${recentAvgPrice}, supply count ${supplyCount}, and season factor ${seasonFactor}.`;

  return {
    suggestedMinPrice: Math.round(suggestedMinPrice * 100) / 100,
    suggestedMaxPrice: Math.round(suggestedMaxPrice * 100) / 100,
    confidence,
    reasoning
  };
}

module.exports = { suggestPrice };
