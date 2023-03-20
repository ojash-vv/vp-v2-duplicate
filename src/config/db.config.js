const { Sequelize } = require("sequelize");

const dbConfig = {
  name: process.env.dbName,
  username: process.env.dbUsername,
  password: process.env.dbPassword,
  host: process.env.dbHost,
  port: process.env.dbPort,
  dialect: process.env.dbDialect,
};

const sequelize = new Sequelize(
  dbConfig?.name,
  dbConfig?.username,
  dbConfig?.password,
  {
    host: dbConfig?.host,
    port: dbConfig?.port,
    dialect: dbConfig?.dialect,
    pool: { min: 0, max: 5, idle: 10000 },
  }
);

module.exports = sequelize;
