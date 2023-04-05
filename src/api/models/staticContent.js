module.exports = (sequalize, DataTypes) => {
  const staticContent = sequalize.define(
    "static_content",
    {
      title: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
      },
      content: DataTypes.TEXT,
      createdBy: DataTypes.INTEGER,
      createdAt: {
        type: DataTypes.DATE,
        required: true,
      },
      updatedAt: DataTypes.DATE,
      updatedBy: DataTypes.INTEGER,
    },

    {
      tableName: "static_content",
      updatedAt: false,
    }
  );
  return staticContent;
};
