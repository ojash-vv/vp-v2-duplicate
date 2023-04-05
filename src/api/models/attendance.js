module.exports = (sequelize, DataTypes) => {
  const EmployeeAttendance = sequelize.define(
    "EmployeeAttendance",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      empId: DataTypes.STRING,
      timeIn: DataTypes.DATE,
      timeOut: DataTypes.DATE,
      totalTime: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "attendance_record",
    }
  );
  return EmployeeAttendance;
};
