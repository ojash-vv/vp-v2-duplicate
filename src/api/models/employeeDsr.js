module.exports = (sequelize, DataTypes) => {
  const employeeDsr = sequelize.define(
    "employeeDsr",
    {
      empId: {
        type: DataTypes.STRING,
        required: true,
        unique: true,
        allowNull: false,
      },
      projectId: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
      },
      workingDate: DataTypes.DATE,
      workingHours: DataTypes.STRING,
      taskDetail: DataTypes.STRING,
      taskStatus: DataTypes.STRING,
      taskMinutes: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      updatedBy: DataTypes.INTEGER,
    },
    {
      tableName: "vp_emp_dsr",
      updatedAt: false,
    }
  );
  return employeeDsr;
};
