const winston = require("winston");

const logConfiguration = {
  //format: winston.format.json(),
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/Logs.log",
    }),
  ],
};

const logger = winston.createLogger(logConfiguration);

exports.logger = logger;
