const QueryIDs = {
  SELECT_USER: "Select * from vp_users",
  STORE_GLOBAL_CAT: "INSERT INTO globaltypecategory SET ?",
  SELECT_MASTER_GLOBAL_Type:
    "SELECT * FROM globaltypes WHERE GlobalTypeCategory_uniqeValue = ?",
};

module.exports = QueryIDs;
