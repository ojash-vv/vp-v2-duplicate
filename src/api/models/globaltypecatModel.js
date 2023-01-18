const e = require("express");
const sql = require("../../../dbConnect");
const MessageTag = require("../../enums/messageNums");
const QueryIDs = require("../../enums/queryeNums");

const Globaltypecategory = function (globalcategory) {
  const unique_value = globalcategory?.name?.replace(/ /g, "_");
  this.display_name = globalcategory?.name;
  this.isActive = globalcategory?.isActive;
  this.unique_value = unique_value?.toLowerCase();
  this.createdAt = new Date(new Date().toUTCString());
  this.updatedAt = new Date(new Date().toUTCString());
};

Globaltypecategory.create = (newCustomer, result) => {
  sql.query(
    QueryIDs.SELECT_GLOBAL_CAT + " where unique_value = ?",
    newCustomer.unique_value,
    (err, row) => {
      if (err) {
        result(err, null);
        return;
      } else {
        if (row && row.length) {
          result(MessageTag.EXIST_GTC, null);
          return;
        } else {
          sql.query(QueryIDs.STORE_GLOBAL_CAT, newCustomer, (err, res) => {
            if (err) {
              result(err, null);
              return;
            }
            result(null, { id: res.insertId, ...newCustomer });
          });
        }
      }
    }
  );
};

Globaltypecategory.findById = (customerId, result) => {
  sql.query(`SELECT * FROM customers WHERE id = ${customerId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Globaltypecategory.getAll = (result) => {
  sql.query(QueryIDs.SELECT_GLOBAL_CAT, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Globaltypecategory.updateById = (id, globlaTypeCategory, result) => {
  sql.query(
    QueryIDs.SELECT_GLOBAL_CAT + " where unique_value = ?",
    globlaTypeCategory.unique_value,
    (err, row) => {
      console.log(row);
      if (err) {
        result(err, null);
        return;
      } else {
        if (row && row.length) {
          result(MessageTag.EXIST_GTC, err);
          return;
        } else {
          sql.query(
            QueryIDs.UPDTAE_GLOBAL_CAT,
            [
              globlaTypeCategory.display_name,
              globlaTypeCategory.unique_value,
              globlaTypeCategory.updatedAt,
              id,
            ],
            (err, res) => {
              if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
              }

              if (res.affectedRows == 0) {
                // not found Customer with the id
                result({ kind: "not_found" }, null);
                return;
              }

              result(null, { id: id, ...globlaTypeCategory });
            }
          );
        }
      }
    }
  );
};
Globaltypecategory.statusUpdateById = (id, globlaTypeCategory, result) => {
  if (globlaTypeCategory?.isActive == 1) {
    isActive = 0;
  } else {
    isActive = 1;
  }
  sql.query(
    QueryIDs.UPDTAE_GLOBAL_CAT_STATUS,
    [isActive, globlaTypeCategory?.updatedAt, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...globlaTypeCategory });
    }
  );
};

Globaltypecategory.remove = (id, result) => {
  sql.query(QueryIDs.DELETE_GLOBAL_CAT, id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, res);
  });
};

Globaltypecategory.removeAll = (result) => {
  sql.query("DELETE FROM customers", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} customers`);
    result(null, res);
  });
};

module.exports = Globaltypecategory;
