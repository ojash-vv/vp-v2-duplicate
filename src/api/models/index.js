// const fs = require("fs");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db.config");
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.roleAndPermissions = require("./rolePermissions")(sequelize, DataTypes);
db.auth = require("./auth")(sequelize, DataTypes);
db.globalTypeCategory = require("./globalTypeCategory")(sequelize, DataTypes);
db.globalType = require("./globalType")(sequelize, DataTypes);
db.employee = require("./employee")(sequelize, DataTypes);
db.employeeDsr = require("./employeeDsr")(sequelize, DataTypes);
db.AttendenceRecord = require("./AttendenceRecord")(sequelize, DataTypes);

// fs.readdirSync(__dirname).forEach((file) => {
//   if (!file.includes("index.js")) {
//     const name = file.split(".")[0].toLocaleLowerCase();
//     db[`${name}`] = require(path.join(__dirname, file));
//     sequelize, DataTypes;
//   }
// });
sequelize.sync().then(() => {
  console.log("sync is done");
});

// db.employee.hasMany(db.AttendenceRecord, {
//   foreignKey: "empId",
//   as: "AttendenceRecord",
// });
// db.AttendenceRecord.belongsTo(db.employee, {
//   foreignKey: "empId",
//   as: "Employee",
// });
db.AttendenceRecord.hasMany(db.employee, {
  foreignKey: "empId",
  as: "Employee",
  required: true,
});
db.employee.belongsTo(db.AttendenceRecord, {
  foreignKey: "empId",
  as: "AttendenceRecord",
  required: true,
});
module.exports = db;
