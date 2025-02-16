import express from "express";
import "./env.js";

const app = express();
const PORT = process.env.PORT || 3100;

app.listen(PORT, () => {
  console.log(`Server is listoning on ${PORT}`);
});
