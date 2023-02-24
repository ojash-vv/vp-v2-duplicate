const { Sequelize } = require("sequelize");

const dbConfig = process.env.NODE_ENV
  ? process.env.LOCAL_DB_URI
  : process.env.PROD_DB_URI;

const sequelize = new Sequelize(dbConfig, {
  pool: { min: 0, max: 5, idle: 10000 },
});

module.exports = sequelize;
