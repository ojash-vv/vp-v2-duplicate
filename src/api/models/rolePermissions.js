module.exports = (sequelize, DataTypes) => {
  const RolePermissions = sequelize.define(
    "RolePermissions",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      moduleId: DataTypes.INTEGER,
      roleId: DataTypes.INTEGER,
      permissions: { type: DataTypes.JSON },
      isDeleted: DataTypes.BOOLEAN,
    },
    {
      tableName: "role_permissions",
    },
  )
  return RolePermissions
}
