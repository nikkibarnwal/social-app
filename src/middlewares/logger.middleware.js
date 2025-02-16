import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

const loggerMiddleware = (req, res, next) => {
  const logData = `${new Date().toString()} req URL: ${req.url}  reqBody:${
    req.body ? JSON.stringify(req.body) : ""
  }`;
  logger.info(logData);
  next();
};

export default loggerMiddleware;
