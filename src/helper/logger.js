const winston = require("winston");
require("winston-daily-rotate-file");
const { colorize, combine, timestamp, printf } = winston.format;

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: "logs/Logs-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
});

const logFormat = printf(({ level, message, timestamp }) => {
  return `//=> [${timestamp}] : [${level}] ${JSON.stringify(message)} `;
});
const logConfiguration = {
  format: combine(
    // colorize(),
    timestamp({
      format: "dd-MM-YYYY HH:mm:ss",
    }),
    logFormat
  ),
  transports: [fileRotateTransport, new winston.transports.Console()],
};

const logger = winston.createLogger(logConfiguration);

exports.logger = logger;
