const db = require("../models/index");
const { isEmpty } = require("lodash");

const RolePermissions = db.roleAndPermissions;

const addRoleAndPermissions = async (req, res) => {
  const roleAndPermissions = req?.body;
  if (!isEmpty(roleAndPermissions)) {
    for (let i = 0; i < roleAndPermissions.length; i++) {
      const roleId = roleAndPermissions[i]?.roleId;
      const moduleId = roleAndPermissions[i]?.moduleId;
      try {
        const isExists = await RolePermissions.findOne({
          where: { roleId: roleId, moduleId: moduleId },
        });

        if (isEmpty(isExists)) {
          const res = await RolePermissions.create({
            moduleId,
            roleId,
            permissions: roleAndPermissions[i]?.permissions,
            createdBy: "user",
            updatedBy: "user",
            createdAt: new Date(),
          });
        } else {
          const { moduleId, roleId, permissions } = roleAndPermissions[i];
          await RolePermissions.update(
            {
              moduleId,
              roleId,
              permissions: permissions,
              updatedBy: "user",
              updatedAt: new Date(),
            },
            {
              where: {
                roleId: roleId,
                moduleId: moduleId,
              },
            }
          );
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

const getPermissionsByRoleId = async (req, res) => {
  const { id: roleId } = req?.params;
  if (roleId) {
    try {
      const permissionsByRoleId = await RolePermissions.findAll({
        where: { roleId: roleId },
      });
      if (permissionsByRoleId.length > 0) {
        res.json({
          status: true,
          data: permissionsByRoleId,
          message: "success",
        });
      } else {
        res.json({
          status: true,
          message: "No record found",
        });
      }
    } catch (error) {
      res.json({
        status: false,
        message: error,
      });
    }
  }
};

module.exports = {
  addRoleAndPermissions,
  getPermissionsByRoleId,
};
