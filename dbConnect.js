const mongoose = require("mongoose");
const { dbUrl, port } = require("./src/config/server.config");
const startServer = require("./server");

const connectToDB = () => {
  mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.info("Database connection successful");
      startServer(port);
    })
    .catch((err) => {
      console.error("Database connection error " + err);
    });
};

module.exports = connectToDB;
