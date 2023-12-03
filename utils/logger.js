const winston = require("winston");
require("winston-daily-rotate-file");

module.exports = winston.createLogger({
  transports: new winston.transports.DailyRotateFile({
    filename: "logs/app-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    levels: winston.config.npm.levels,
    format: winston.format.combine(
      winston.format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
      winston.format.align(),
      winston.format.printf(
        (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
      )
    ),
  }),
});
