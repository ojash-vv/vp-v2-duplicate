module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "Employee",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      empId: DataTypes.STRING,
      userName: DataTypes.STRING,
      userPersonalEmail: DataTypes.STRING,
      userEmail: DataTypes.STRING,
      userPassword: DataTypes.STRING,
      userDesignation: DataTypes.STRING,
      userRole: DataTypes.STRING,
      userProfileImg: DataTypes.TEXT,
      empMobileNumber: DataTypes.STRING,
      userBirthday: DataTypes.STRING,
      empStartDate: DataTypes.DATE,
      empJoinDate: DataTypes.DATE,
      empSalary: DataTypes.DATE,
      empAddress: DataTypes.TEXT,
      userPasswordToken: DataTypes.TEXT,
      userPasswordTokenDtm: DataTypes.DATE,
      isActive: DataTypes.TINYINT,
      isDeleted: DataTypes.TINYINT,
      userLocked: DataTypes.INTEGER,
    },
    {
      tableName: "vp_users",
    }
  );
  return Employee;
};
