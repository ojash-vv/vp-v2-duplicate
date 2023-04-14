module.exports = (sequelize, DataTypes) => {
  const FormBuilder = sequelize.define(
    "FormBuilder",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      formType: DataTypes.STRING,
      questionName: DataTypes.STRING,
      answerType: DataTypes.STRING,
      mcqOptions: DataTypes.JSON,
      selectionType: DataTypes.INTEGER,
      isActive: DataTypes.INTEGER,
      createdBy: DataTypes.STRING,
      updatedBy: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "form_builder",
    },
  )
  return FormBuilder
}
