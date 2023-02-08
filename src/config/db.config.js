const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("virtuevi_vp", "root", "", {
  host: "localhost",
  dialect: "mysql",
  pool: { min: 0, max: 5, idle: 10000 },
});

module.exports = sequelize;
