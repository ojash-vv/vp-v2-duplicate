const { port } = require("./src/config/server.config");
const startServer = require("./server");
const dbConnection = require("./src/config/db.config");

const connectToDB = () => {
  dbConnection.connect((err, connection) => {
    if (err) {
      console.info("There was an error connecting to db", err);
    } else {
      console.log("DB connected successfull !!!!");
      startServer(port);
    }
  });
};

module.exports = connectToDB;
