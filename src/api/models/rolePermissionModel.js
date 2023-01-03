const dbConnection = require("../../config/db.config");

class RoleAndPermissions {
  constructor(role) {
    (this.module_id = role.moduleId),
      (this.role_id = role.roleId),
      (this.permissions = role.permissions),
      (this.created_by = role.createdBy),
      (this.updated_by = role.updatedBy),
      (this.created_at = role.createdAt),
      (this.updated_at = role.updatedAt || null),
      (this.is_deleted = role.isDeleted ? true : false);
  }
  static async createNewRoleWithPermissions(roleAndPermissions, result) {
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
  }
  static async updateRoleWithPermissions(roleAndPermissions, result) {
    const { permissions, updated_at, updated_by, role_id, module_id } =
      roleAndPermissions;
    await dbConnection.query(
      `UPDATE role_permissions SET permissions = ?, updated_by=?,updated_at=? WHERE role_id =?  AND module_id =?`,
      [permissions, updated_by, updated_at, role_id, module_id],
      (err, res) => {
        if (err) {
          console.info("Error while inserting the data", err);
          return result(err, null);
        } else {
          console.info(res);
          return result(null, res);
        }
      }
    );
  }
  static async getPermissionsByRoleId(roleId, result) {
    await dbConnection.query(
      `SELECT * FROM role_permissions WHERE  is_deleted = 'false' and role_id = ?`,
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
  }
  static isRoleIdAndModuleIdExist(roleId, moduleId) {
    return new Promise(async (resolve, reject) => {
      await dbConnection.query(
        `SELECT id, role_id, module_id, permissions, is_deleted FROM role_permissions WHERE  is_deleted = 'false' and role_id = ${roleId} AND module_id = ${moduleId}`,
        (err, res) => {
          if (err) {
            console.info("Error while featching the data");
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  }
}

module.exports = RoleAndPermissions;
