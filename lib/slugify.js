module.exports = {
  slugify: function(str) {
    if (typeof str !== 'string') return '';
    
    const lowercasedStr = str.toLowerCase();
    const trimmedStr = lowercasedStr.trim();

    // Replace runs of non-alphanumeric characters with a single '-'
    let result = trimmedStr.replace(/[^a-z0-9]+/g, '-');

    // Remove leading/trailing '-' if any
    return result.startsWith('-') ? result.slice(1) : (result.endsWith('-') ? result.slice(0, -1) : result);
  }
};