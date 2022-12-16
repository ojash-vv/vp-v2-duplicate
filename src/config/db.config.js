const mysql = require("mysql");

// create the connection to database
const dbConnection = mysql.createConnection({
  connectionLimit: 100,
  host: "127.0.0.1",
  user: "root",
  password: "VirtueVise@234",
  database: "virtuevi_vp",
  port: 3306,
});

module.exports = dbConnection;
