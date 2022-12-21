const express = require("express");
const app = express();
var mysql = require("mysql");

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "virtuevi_vp",
// });
// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
//   startServer(port);
// });
const db = mysql.createPool({
  connectionLimit: 100,
  host: "127.0.0.1", //This is your localhost IP
  user: "root", // "newuser" created in Step 1(e)
  password: "", // password for the new user
  database: "virtuevi_vp", // Database name
  port: "3306", // port name, "3306" by default
});
db.getConnection((err, connection) => {
  if (err) throw err;
  console.log("DB connected successful: " + connection.threadId);
});

module.exports = db;
