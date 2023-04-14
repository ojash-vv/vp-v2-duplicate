module.exports = (sequelize, DataTypes) => {
  const SavedFormData = sequelize.define(
    'SavedFormData',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      submittedBy: DataTypes.STRING,
      formType: DataTypes.STRING,
      formData: DataTypes.JSON,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: 'saved_form_answers',
    },
  )
  return SavedFormData
}
