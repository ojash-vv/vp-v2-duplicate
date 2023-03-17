module.exports = (sequalize, DataTypes) => {
  const AttendenceRecord = sequalize.define(
    "AttendenceRecord",
    {
      empId: {
        foreignKey: true,
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
      },
      timeIn: {
        type: DataTypes.DATE,
        required: true,
      },
      timeOut: DataTypes.DATE,
      isPresent: DataTypes.TINYINT,
      totalTime: DataTypes.STRING,
      createdBy: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        required: true,
      },
      updatedAt: DataTypes.DATE,
      updatedBy: DataTypes.STRING,
    },
    {
      tableName: "attendance_record",
      updatedAt: false,
    }
  );
  return AttendenceRecord;
};
