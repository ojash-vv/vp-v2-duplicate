const RoleAndPermissionsModel = require("../models/rolePermissionModel");
const { isEmpty } = require("lodash");

const addRoleAndPermissions = (req, res) => {
  const roleAndPermissions = req?.body;
  if (!isEmpty(roleAndPermissions)) {
    for (let i = 0; i < roleAndPermissions.length; i++) {
      console.log(
        "🚀 ~ file: rolePermissionContoller.js:8 ~ addRoleAndPermissions ~ roleAndPermissions",
        roleAndPermissions[i]
      );
      const role = new RoleAndPermissionsModel({
        moduleId: roleAndPermissions[i]?.moduleId,
        roleId: roleAndPermissions[i]?.roleId,
        permissions: JSON.stringify(roleAndPermissions[i]?.permissions),
        createdBy: "user",
        updatedBy: "user",
        createdAt: new Date(),
      });
      if (role) {
        RoleAndPermissionsModel.createNewRoleWithPermissions(role, (err, _) => {
          if (err) {
            res.json({ status: false, message: err });
          } else if (i === roleAndPermissions.length - 1) {
            res.json({
              status: true,
              message: "record created successfully",
            });
          }
        });
      }
    }
  }
};
const updateRoleAndPermissions = (req, res) => {
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
      RoleAndPermissionsModel.updateRoleWithPermissions(role, (err, _) => {
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
                moduleId: item.module_id,
                permissions: JSON.parse(item.permissions),
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
