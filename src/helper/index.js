function camelize(str) {
  return str.replace(/\W+(.)/g, (match, chr) => chr.toUpperCase())
}
function formatObject(record) {
  const obj = {}
  const keys = Object.keys(record)
  keys.forEach((key) => {
    let formatKey = key
    formatKey = formatKey.replace("_", " ")
    formatKey = camelize(formatKey)
    obj[formatKey] = record[key]
  })
  return obj
}
function formatKeys(data) {
  if (Array.isArray(data)) {
    const formattedKeys = data.map((record) => formatObject(record))
    return formattedKeys
  }
  return formatObject(data)
}

exports.formatKeys = formatKeys
