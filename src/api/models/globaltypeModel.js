const sql = require("../../../dbConnect");
const MessageTag = require("../../enums/messageNums");
const QueryIDs = require("../../enums/queryeNums");

const Globaltype = function (globaltype) {
  this.globalTypeCategory_uniqeValue = globaltype?.globalTypeCategory;
  this.displayName = globaltype?.name;
  const unique_value = globaltype?.name;
  this.uniqueValue = unique_value?.toLowerCase();
  this.createdAt = new Date(new Date().toUTCString());
  this.updatedAt = new Date(new Date().toUTCString());
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

Globaltype.create = (newData, result) => {
  sql.query(
    QueryIDs.SELECT_GLOBAL_CAT + " where unique_value = ?",
    newData.globalTypeCategory_uniqeValue,
    (err, row) => {
      if (err) {
        result(err, null);
        return;
      } else {
        if (row && row.length) {
          sql.query(
            QueryIDs.SELECT_GLOBAL_TYPE + " where uniqueValue = ?",
            newData.uniqueValue,
            (err, row) => {
              if (err) {
                result(err, null);
                return;
              } else {
                if (row && row.length) {
                  result(MessageTag.GLOBALTYPE_EXIST, null);
                  return;
                } else {
                  sql.query(QueryIDs.STORE_GLOBAL_TYPE, newData, (err, res) => {
                    if (err) {
                      result(err, null);
                      return;
                    }
                    result(null, { id: res.insertId, ...newData });
                  });
                }
              }
            }
          );
        } else {
          result(MessageTag.GTC_NOT, err);
          return;
        }
      }
    }
  );
};

Globaltype.getAll = (result) => {
  sql.query(QueryIDs.SELECT_GLOBAL_TYPE, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Globaltype.updateById = (id, globlaType, result) => {
  console.log(globlaType?.uniqueValue);
  sql.query(
    QueryIDs.SELECT_GLOBAL_TYPE + " where uniqueValue = ?",
    globlaType?.uniqueValue,
    (err, row) => {
      if (err) {
        result(err, null);
        return;
      } else {
        if (row && row.length) {
          result(MessageTag.GLOBALTYPE_EXIST, err);
          return;
        } else {
          sql.query(
            QueryIDs.UPDTAE_GLOBAL_TYPE,
            [
              globlaType?.displayName,
              globlaType?.uniqueValue,
              globlaType?.updatedAt,
              id,
            ],
            (err, res) => {
              if (err) {
                result(null, err);
                return;
              }

              if (res.affectedRows == 0) {
                result({ kind: MessageTag.GLOBALTYPE_NOT_EXIST }, null);
                return;
              }

              result(null, { id: id, ...globlaType });
            }
          );
        }
      }
    }
  );
};

Globaltype.remove = (id, result) => {
  sql.query(QueryIDs.DELETE_GLOBAL_TYPE, id, (err, res) => {
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

module.exports = Globaltype;
