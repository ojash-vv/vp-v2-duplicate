const mysql = require("mysql");
const util = require("util");

// create the connection to database
const dbConnection = mysql.createPool({
  connectionLimit: 100,
  host: "localhost",
  user: "root",
  password: "password",
  database: "virtuevi_vp",
  port: 3306,
  timezone: "UTC",
});

// Promisify for Node.js async/await.
dbConnection.query = util.promisify(dbConnection.query).bind(dbConnection);

module.exports = dbConnection;
