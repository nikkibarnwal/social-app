import express from "express";
import "./env.js";
import connectDB from "./src/config/mongodb.js";

const app = express();
const PORT = process.env.PORT || 3100;

app.listen(PORT, () => {
  console.log(`Server is listoning on ${PORT}`);
  connectDB();
});
