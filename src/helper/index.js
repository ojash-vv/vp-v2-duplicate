const moment = require("moment");

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

function localToUTC(date) {
  return new moment(date, "YYYY-MM-DDTHH:mm").utc();
}
function formatDate(date) {
  return new moment(date).format("YYYY-MM-DD");
}
// Returns an array of dates between the two dates
function getDates(startDate, endDate) {
  const date = new Date(startDate.getTime());

  const dates = [];

  while (date <= endDate) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}
module.exports = {
  formatKeys: formatKeys,
  localToUTC: localToUTC,
  getDates: getDates,
  formatDate: formatDate,
};
