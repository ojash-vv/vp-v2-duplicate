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
  return new moment(date, "YYYY-MM-DD").utc();
}
function formatDate(date) {
  return moment(date).format("YYYY-MM-DD")
}
// Returns an array of dates between the two dates
function getDates(startDate, endDate) {
  const date = new Date(startDate.getTime())

  const dates = []

  while (date <= endDate) {
    const dateNew=new Date(date).toDateString();
    const formatDate=this.formatDate(dateNew)
    dates.push(formatDate);
    date.setDate(date.getDate() + 1);
  }

  return dates
}
module.exports = {
  formatKeys,
  localToUTC,
  getDates,
  formatDate,
}
