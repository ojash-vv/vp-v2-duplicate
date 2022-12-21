const sql = require("../../../dbConnect");
const QueryIDs = require("../../enums/queryenums");

const Globaltype = function (globaltype) {
  const unique_value = globaltype.name;
  this.unique_value = unique_value.toLowerCase();
};

Globaltype.findByUniqueValue = (unique_value, result) => {
  sql.query(QueryIDs.SELECT_MASTER_GLOBAL_Type, unique_value, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

module.exports = Globaltype;
