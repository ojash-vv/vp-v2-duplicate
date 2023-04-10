module.exports = (sequelize, DataTypes) => {
  const EmployeeLeave = sequelize.define(
    "EmployeeLeave",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      empId: DataTypes.STRING,
      leaveType: DataTypes.STRING,
      leaveFrom: DataTypes.DATE,
      leaveTo: DataTypes.DATE,
      leaveDays: DataTypes.JSON,
      contacNum: DataTypes.STRING,
      leaveReason: DataTypes.STRING,
      addressDuringLeave: DataTypes.STRING,
      leaveStatus: DataTypes.INTEGER,
      rejectReason: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "emp_apply_leave",
    }
  );
  return EmployeeLeave;
};
