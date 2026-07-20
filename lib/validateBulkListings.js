function validateBulkListings(fileBuffer, schema) {
  const validated = [];
  const errors = [];
  if (!Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
    errors.push({ row: 0, message: "Empty buffer" });
    return { validated, errors };
  }
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    errors.push({ row: 0, message: 'Invalid schema' });
    return { validated, errors };
  }
  let records;
  try {
    const content = fileBuffer.toString("utf-8").trim();
    if (!content) {
      errors.push({ row: 0, message: "Empty content" });
      return { validated, errors };
    }
    if (content.startsWith("[")) {
      records = JSON.parse(content);
    } else {
      const lines = content.split("\n");
      if (lines.length < 2) {
        errors.push({ row: 0, message: "CSV must have header and at least one data row" });
        return { validated, errors };
      }
      const headers = lines[0].split(",").map(h => h.trim());
      records = [];
      for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].split(",").map(v => v.trim());
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = vals[idx] !== undefined ? vals[idx] : ""; });
        records.push(obj);
      }
    }
  } catch (e) {
    errors.push({ row: 0, message: "Malformed input: " + e.message });
    return { validated, errors };
  }
  if (!Array.isArray(records)) {
    errors.push({ row: 0, message: "Input must be an array of objects" });
    return { validated, errors };
  }
  const seenSkus = new Set();
  for (let i = 0; i < records.length; i++) {
    const row = i + 1;
    const item = records[i];
    const rowErrors = [];
    if (!item || typeof item !== "object") {
      errors.push({ row, message: "Invalid record format" });
      continue;
    }
    if (!item.title || typeof item.title !== "string" || item.title.trim() === "") {
      rowErrors.push("title is required and must be a non-empty string");
    }
    if (!item.category || typeof item.category !== "string" || item.category.trim() === "") {
      rowErrors.push("category is required and must be a non-empty string");
    }
    if (!item.condition || typeof item.condition !== "string" || item.condition.trim() === "") {
      rowErrors.push("condition is required and must be a non-empty string");
    }
    const price = Number(item.price);
    if (item.price === undefined || item.price === null || item.price === "" || !Number.isFinite(price) || price < 0) {
      rowErrors.push("price is required and must be a non-negative number");
    }
    if (item.sku !== undefined && item.sku !== null && item.sku !== "") {
      const skuStr = String(item.sku);
      if (seenSkus.has(skuStr)) {
        rowErrors.push("duplicate SKU: " + skuStr);
      } else {
        seenSkus.add(skuStr);
      }
    }
    if (schema && typeof schema === "object") {
      for (const key of Object.keys(schema)) {
        if (!schema[key] || typeof schema[key] !== 'object') { rowErrors.push(key + ' has invalid schema'); continue; }
        if (schema[key].required && (item[key] === undefined || item[key] === null || item[key] === "")) {
          rowErrors.push(key + " is required by schema");
        }
        if (schema[key].type === "number" && item[key] !== undefined && item[key] !== null && item[key] !== "") {
          if (!Number.isFinite(Number(item[key]))) {
            rowErrors.push(key + " must be a number");
          }
        }
        if (schema[key].type === "string" && item[key] !== undefined && item[key] !== null && typeof item[key] !== "string") {
          rowErrors.push(key + " must be a string");
        }
      }
    }
    if (rowErrors.length > 0) {
      errors.push({ row, message: rowErrors.join("; ") });
    } else {
      const cleanItem = {
        title: item.title.trim(),
        category: item.category.trim(),
        condition: item.condition.trim(),
        price: price
      };
      if (item.sku !== undefined && item.sku !== null && item.sku !== "") {
        cleanItem.sku = String(item.sku);
      }
      for (const key of Object.keys(schema || {})) {
        if (item[key] !== undefined && !["title","category","condition","price","sku"].includes(key)) {
          cleanItem[key] = schema[key].type === "number" ? Number(item[key]) : item[key];
        }
      }
      validated.push(cleanItem);
    }
  }
  return { validated, errors };
}

module.exports = { validateBulkListings };
