const RoleAndPermissionsModel = require("../models/rolePermissionModel");
const { isEmpty } = require("lodash");

const updateRoleAndPermissions = (roleAndPermission) => {
  const { moduleId, roleId, permissions } = roleAndPermission;
  return new Promise(async (resolve, reject) => {
    if (moduleId) {
      const updatedRoleAndPermission = new RoleAndPermissionsModel({
        moduleId,
        roleId,
        permissions: JSON.stringify(permissions),
        updatedBy: "user",
        updatedAt: new Date(),
      });
      await RoleAndPermissionsModel.updateRoleWithPermissions(
        updatedRoleAndPermission,
        (err, _) => {
          if (err) {
            reject(err);
          } else {
            resolve(_);
          }
        }
      );
    }
  });
};
const addRoleAndPermissions = async (req, res) => {
  const roleAndPermissions = req?.body;
  if (!isEmpty(roleAndPermissions)) {
    for (let i = 0; i < roleAndPermissions.length; i++) {
      const roleId = roleAndPermissions[i]?.roleId;
      const moduleId = roleAndPermissions[i]?.moduleId;
      try {
        const isExists = await RoleAndPermissionsModel.isRoleIdAndModuleIdExist(
          roleId,
          moduleId
        );
        if (isEmpty(isExists)) {
          const role = new RoleAndPermissionsModel({
            moduleId,
            roleId,
            permissions: JSON.stringify(roleAndPermissions[i]?.permissions),
            createdBy: "user",
            updatedBy: "user",
            createdAt: new Date(),
          });
          if (role) {
            RoleAndPermissionsModel.createNewRoleWithPermissions(
              role,
              (err, _) => {
                if (err) {
                  res.status(400).json({ status: false, message: err });
                }
              }
            );
          }
        } else {
          const curruntRoleAndPermission = roleAndPermissions[i];
          await updateRoleAndPermissions(curruntRoleAndPermission);
        }
      } catch (error) {
        res.status(400).json({ status: false, message: error });
      }
      if (i === roleAndPermissions.length - 1) {
        res.json({
          status: true,
          message: "record created/updated successfully",
        });
      }
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
                createdAt: item.created_at,
                updatedAt: item.updated_at,
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
