// const connectToDB = require("./dbConnect");
var indexRouter = require("./src/api/routes");

var express = require("express");
var cors = require("cors");
var path = require("path");
var app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/", indexRouter);
app.use(function (req, res, next) {
  //   next(createError(404));
});

app.listen(4004, function () {
  console.log("Listening on 4004 Port");
});

module.exports = app;

// connectToDB();
