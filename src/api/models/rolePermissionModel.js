const dbConnection = require("../../config/db.config");

const RoleAndPermissions = function (role) {
  (this.module_id = role.moduleId),
    (this.role_id = role.roleId),
    (this.permissions = role.permissions),
    (this.created_by = role.createdBy),
    (this.updated_by = role.updatedBy),
    (this.created_at = role.createdAt),
    (this.updated_at = role.updatedAt || null),
    (this.is_deleted = role.isDeleted ? true : false);
};

RoleAndPermissions.createNewRoleWithPermissions = (
  roleAndPermissions,
  result
) => {
  dbConnection.query(
    "INSERT INTO role_permissions SET ?",
    roleAndPermissions,
    (err, res) => {
      if (err) {
        console.info("Error while inserting the data");
        return result(err, null);
      } else {
        console.info(res);
        return result(null, res);
      }
    }
  );
};
RoleAndPermissions.updateRoleWithPermissions = (roleAndPermissions, result) => {
  dbConnection.query(
    "INSERT INTO role_permissions SET ?",
    roleAndPermissions,
    (err, res) => {
      if (err) {
        console.info("Error while featching the data");
        return result(err, null);
      } else {
        console.info(res);
        return result(null, res);
      }
    }
  );
};
RoleAndPermissions.getPermissionsByRoleId = (roleId, result) => {
  dbConnection.query(
    `SELECT id, role_id, module_id, permissions, is_deleted FROM role_permissions WHERE  is_deleted = 'false' and role_id = ?`,
    roleId,
    (err, res) => {
      if (err) {
        console.info("Error while featching the data");
        return result(err, null);
      } else {
        return result(null, res);
      }
    }
  );
};

module.exports = RoleAndPermissions;
