import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import Main from "./src/routes/main.js";
dotenv.config();
const app = express()
app.use("/", Main)



app.listen(3000, () => {
  console.log("running")
})
