import { createLogger, format, transports } from "winston";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = createLogger({
  level: "info", // Logs both info (requests) & errors
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json() // Logs in JSON format
  ),
  transports: [
    new transports.File({
      filename: path.join(__dirname, "../../logs/app.log"),
    }), // ✅ Logs all requests & errors
    new transports.File({
      filename: path.join(__dirname, "../../logs/error.log"),
      level: "error",
    }), // ✅ Logs only errors
    // new transports.Console(), // ✅ Logs to console as well
  ],
});

export const requestLogger = (req, res, next) => {
  logger.info({
    message: "Incoming Request",
    method: req.method,
    route: req.originalUrl,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });
  next();
};

export const logError = (err, req, res, next) => {
  logger.error({
    message: err.logMessage || err.message,
    statusCode: err.statusCode || 500,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  next(err); // Pass error to errorHandler
};

export default logger;
