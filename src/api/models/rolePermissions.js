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
      createdBy: DataTypes.STRING,
      updatedBy: DataTypes.STRING,
      isDeleted: DataTypes.BOOLEAN,
    },
    {
      tableName: "role_permissions",
    }
  );
  return RolePermissions;
};
