module.exports = (sequelize, DataTypes) => {
  const GlobalTypeCategory = sequelize.define(
    "GlobalTypeCategory",
    {
      uniqueValue: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      displayName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      isActive: DataTypes.INTEGER,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      isDeleted: DataTypes.BOOLEAN,
    },
    {
      tableName: "globaltypecategory",
    }
  );
  return GlobalTypeCategory;
};
