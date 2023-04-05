module.exports = (sequelize, DataTypes) => {
  const VpUsers = sequelize.define(
    "Auth",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      empId: DataTypes.STRING,
      userEmail: DataTypes.STRING,
      userPassword: DataTypes.STRING,
      userRole: DataTypes.STRING,
      isDeleted: DataTypes.BOOLEAN,
    },
    {
      tableName: "vp_users",
    },
  )
  return VpUsers
}
