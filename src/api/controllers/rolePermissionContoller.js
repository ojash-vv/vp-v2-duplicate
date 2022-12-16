const RoleAndPermissionsModel = require("../models/rolePermissionModel");

const addRoleAndPermissions = (req, res) => {
  const { moduleId, permissions, roleId } = req?.body;
  if (moduleId) {
    const role = new RoleAndPermissionsModel({
      moduleId: moduleId,
      roleId: roleId,
      permissions: permissions,
      createdBy: "user",
      updatedBy: "user",
      createdAt: new Date(),
    });
    if (role) {
      RoleAndPermissionsModel.createNewRoleWithPermissions(role, (err, _) => {
        if (err) {
          res.send(err);
        } else {
          res.json({
            status: true,
            message: "record created successfully",
          });
        }
      });
    }
  }
};
const getPermissionsByRoleId = (req, res) => {
  const { id: roleId } = req?.params;
  if (roleId) {
    RoleAndPermissionsModel.getPermissionsByRoleId(
      Number(roleId),
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          if (result.length > 0) {
            res.json({
              status: true,
              data: result.map((item) => ({
                id: item.id,
                roleId: item.role_id,
                permissions: item.permissions,
                isDeleted: item.is_deleted,
              })),
            });
          } else {
            res.json({
              status: true,
              message: "No record found",
            });
          }
        }
      }
    );
  }
};

module.exports = {
  addRoleAndPermissions,
  getPermissionsByRoleId,
};
