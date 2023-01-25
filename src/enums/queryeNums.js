const QueryIDs = {
  SELECT_USER: "Select * from vp_users",
  SELECT_GLOBAL_CAT: "Select * from globaltypecategory",
  STORE_GLOBAL_CAT: "INSERT INTO globaltypecategory SET ?",
  SELECT_MASTER_GLOBAL_Type:
    "SELECT * FROM globaltypes WHERE GlobalTypeCategory_uniqeValue = ?",
  UPDTAE_GLOBAL_CAT:
    "UPDATE globaltypecategory SET display_name = ?,unique_value=?, updatedAt = ? WHERE id = ?",
  UPDTAE_GLOBAL_CAT_STATUS:
    "UPDATE globaltypecategory SET isActive = ?, updatedAt = ? WHERE id = ?",
  DELETE_GLOBAL_CAT: "DELETE FROM globaltypecategory WHERE id = ?",

  SELECT_GLOBAL_TYPE: "Select * from globaltypes",
  STORE_GLOBAL_TYPE: "INSERT INTO globaltypes SET ?",
  UPDTAE_GLOBAL_TYPE:
    "UPDATE globaltypes SET displayName = ?,uniqueValue = ?, globalTypeCategory_uniqeValue=?, updatedAt = ? WHERE id = ?",
  UPDTAE_GLOBAL_TYPE_STATUS:
    "UPDATE globaltypes SET isActive = ?, updatedAt = ? WHERE id = ?",
  DELETE_GLOBAL_TYPE: "DELETE FROM globaltypes WHERE id = ?",

  STORE_USER: "INSERT INTO vp_users SET ?",
};
module.exports = QueryIDs;
