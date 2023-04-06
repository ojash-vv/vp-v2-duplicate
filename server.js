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
  staticContent,
  eventRoute,
} = require("./src/api/routes/index");

const httpServer = http.createServer(app)

const startServer = (port) => {
  // middleware
  app.use(express.json())
  app.use("*", cors())
  app.use("/api/v1/role/", roleRoute)
  app.use("/api/v1/auth/", authRoute)
  app.use("/api/v1/globaltypecategory/", globalTypeCategory)
  app.use("/api/v1/globaltype/", globalType)
  app.use("/api/v1/employee", employeeRoute)
  app.use("/api/v1/staticContent", staticContent);
  app.use("/api/v1/event", eventRoute);

  httpServer.listen(port, () => {
    console.info(`Server is on ${port}`)
  })
  httpServer.timeout = 60000
}

module.exports = startServer
