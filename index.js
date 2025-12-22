import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import Main from "./src/routes/main.js";
dotenv.config();
const app = express()
app.use("/v1/api", Main)


app.get("/", (req, res) => {
  res.json({
    message: "testing server"
  })
})

app.listen(3000, () => {
  console.log("running")
})
