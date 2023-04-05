/* eslint-disable no-console */
const http = require("http")
const express = require("express")

const app = express()
const cors = require("cors")

const {
  authRoute,
  roleRoute,
  globalTypeCategory,
  globalType,
  employeeRoute,
<<<<<<< HEAD
  staticContent,
} = require("./src/api/routes/index");
=======
} = require("./src/api/routes/index")
>>>>>>> c42ef9c4ff1c6f9a302beb28ee50016a38b37a54

const httpServer = http.createServer(app)

const startServer = (port) => {
<<<<<<< HEAD
  //middleware
  app.use(express.json());
  app.use("*", cors());
  app.use("/api/v1/role/", roleRoute);
  app.use("/api/v1/auth/", authRoute);
  app.use("/api/v1/globaltypecategory/", globalTypeCategory);
  app.use("/api/v1/globaltype/", globalType);
  app.use("/api/v1/employee", employeeRoute);
  app.use("/api/v1/staticContent", staticContent);
=======
  // middleware
  app.use(express.json())
  app.use("*", cors())
  app.use("/api/v1/role/", roleRoute)
  app.use("/api/v1/auth/", authRoute)
  app.use("/api/v1/globaltypecategory/", globalTypeCategory)
  app.use("/api/v1/globaltype/", globalType)
  app.use("/api/v1/employee", employeeRoute)
>>>>>>> c42ef9c4ff1c6f9a302beb28ee50016a38b37a54
  httpServer.listen(port, () => {
    console.info(`Server is on ${port}`)
  })
  httpServer.timeout = 60000
}

module.exports = startServer
