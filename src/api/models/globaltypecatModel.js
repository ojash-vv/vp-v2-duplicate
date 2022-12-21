const sql = require("../../../dbConnect");
const QueryIDs = require("../../enums/queryenums");
// constructor
const Globaltypecategory = function (globalcategory) {
  const unique_value = globalcategory.name;
  this.display_name = globalcategory.name;
  this.unique_value = unique_value.toLowerCase();
};

Globaltypecategory.create = (newCustomer, result) => {
  sql.query(QueryIDs.STORE_GLOBAL_CAT, newCustomer, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newCustomer });
  });
};

module.exports = Globaltypecategory;
