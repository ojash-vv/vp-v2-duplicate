const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const indexRouter = require("./src/api/routes/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("*", cors());

app.use("/auth", indexRouter);

app.use((req, res, next) => {
  next();
});
app.use((err, req, res, next) => {
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
