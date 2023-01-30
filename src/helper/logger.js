const winston = require("winston");
require("winston-daily-rotate-file");

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: "logs/Logs-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
});

const logConfiguration = {
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.json()
  ),
  transports: [fileRotateTransport, new winston.transports.Console()],
};

const logger = winston.createLogger(logConfiguration);

exports.logger = logger;
