module.exports = (sequelize, DataTypes) => {
  const ProjectsName = sequelize.define(
    "projectsName",
    {
      projectId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      projectName: DataTypes.STRING,
    },
    {
      tableName: "projects_name",
    }
  );
  return ProjectsName;
};
