const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
// const { authRoute } = require("./src/api/routes/index");
const indexRouter = require("./src/api/routes/auth");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("*", cors());
// app.use("/api/v1/auth/", authRoute);

app.use("/auth", indexRouter);

app.use((req, res, next) => {
  next();
});
// Handling Errors
app.use((err, req, res, next) => {
  // console.log(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

const httpServer = http.createServer(app);
const startServer = (port) => {
  httpServer.listen(port, () => {
    console.info(`Server is on ${port}`);
  });
  httpServer.timeout = 60000;
};

module.exports = startServer;
