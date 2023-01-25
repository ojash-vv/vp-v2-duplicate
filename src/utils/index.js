function formatKeys(data) {
  if (Array.isArray(data)) {
    data = data.map((record) => {
      return formatObject(record);
    });
    return data;
  } else {
    return formatObject(data);
  }
}

function formatObject(record) {
  let obj = {};
  const keys = Object.keys(record);
  keys.map((key) => {
    let formatKey = key;
    formatKey = formatKey.replace("_", " ");
    formatKey = camelize(formatKey);
    obj[formatKey] = record[key];
  });
  return obj;
}
function camelize(str) {
  return str.replace(/\W+(.)/g, function (match, chr) {
    return chr.toUpperCase();
  });
}
exports.formatKeys = formatKeys;
