/* Importing the express module to create an Express application.*/
import express from "express";

/* Importing environment variables from env.js file.*/
import "./env.js";

/* Importing the cors module to enable Cross-Origin Resource Sharing.*/
import cors from "cors";

/* Importing the connectDB function to connect to MongoDB.*/
import connectDB from "./src/config/mongodb.js";

import invalidRoutesHandlerMiddleware from "./src/middlewares/invalidRoutes.middleware.js";
import userRouter from "./src/features/user/user.routes.js";
import { errorHandlerMiddleware } from "./src/middlewares/errorHandler.middleware.js";
import { logError, requestLogger } from "./src/middlewares/logger.js";
import postRouter from "./src/features/posts/posts.routes.js";
import jwtAuthMiddleware from "./src/middlewares/jwtAuth.middleware.js";

/* Creating an instance of an Express application.*/
const app = express();

/* Enabling CORS for all routes. */
app.use(cors());

/* Parsing incoming request bodies in JSON format.*/
app.use(express.json());

/* Parsing incoming request bodies with URL-encoded payloads. */
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger); // ✅ Logs incoming requests

// default route
app.get("/", (req, res) => {
  res.send("Welcome to social api postway");
});

app.use("/api/users", userRouter);

// only logged in user can access the posts management
app.use("/api/posts", jwtAuthMiddleware, postRouter);

app.use(invalidRoutesHandlerMiddleware);

// ✅ Error Logging Middleware (MUST BE BEFORE errorHandler)
app.use(logError);

// Middleware to handle errors
app.use(errorHandlerMiddleware);

/* Starting the server on the specified port and connecting to the database.*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
  connectDB();
});
