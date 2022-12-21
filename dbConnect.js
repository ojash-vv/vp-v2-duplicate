const express = require("express");
const app = express();
var mysql = require("mysql");

const db = mysql.createPool({
  connectionLimit: 100,
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "virtuevi_vp",
  port: "3306",
});
db.getConnection((err, connection) => {
  if (err) throw err;
  console.log("DB connected successful: " + connection.threadId);
});

module.exports = db;
