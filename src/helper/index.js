const moment = require("moment")

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

function localToUTC(date) {
  return moment(date, "YYYY-MM-DDTHH:mm").utc()
}
function formatDate(date) {
  return moment(date).format("YYYY-MM-DD")
}
// Returns an array of dates between the two dates
function getDates(startDate, endDate) {
  const date = new Date(startDate.getTime())

  const dates = []

  while (date <= endDate) {
    dates.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }

  return dates
}
module.exports = {
  formatKeys,
  localToUTC,
  getDates,
  formatDate,
}
