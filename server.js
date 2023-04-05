const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const {
  authRoute,
  roleRoute,
  globalTypeCategory,
  globalType,
  employeeRoute,
  staticContent,
} = require("./src/api/routes/index");

//middleware
app.use(express.json());
app.use((req, res, next) => {
  next();
});

const httpServer = http.createServer(app);

const startServer = (port) => {
  app.use("*", cors());
  app.use("/api/v1/role/", roleRoute);
  app.use("/api/v1/auth/", authRoute);
  app.use("/api/v1/globaltypecategory/", globalTypeCategory);
  app.use("/api/v1/globaltype/", globalType);
  app.use("/api/v1/employee", employeeRoute);
  app.use("/api/v1/staticContent", staticContent);
  httpServer.listen(port, () => {
    console.info(`Server is on ${port}`);
  });
  httpServer.timeout = 60000;
};

module.exports = startServer;
