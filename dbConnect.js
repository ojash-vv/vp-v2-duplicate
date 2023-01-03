const { port } = require("./src/config/server.config");
const startServer = require("./server");
const dbConnection = require("./src/config/db.config");

const connectToDB = () => {
  // Ping database to check for common exception errors.
  dbConnection.getConnection((err, connection) => {
    if (err) {
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        console.error("Database connection was closed.");
      }
      if (err.code === "ER_CON_COUNT_ERROR") {
        console.error("Database has too many connections.");
      }
      if (err.code === "ECONNREFUSED") {
        console.error("Database connection was refused.");
      }
    }

    if (connection) {
      connection.release();
      console.log("DB connected successfull !!!!");
      startServer(port);
    }
  });
};

module.exports = connectToDB;
