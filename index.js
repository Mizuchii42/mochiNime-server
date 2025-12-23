import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import Main from "./src/routes/main.js";
import cors from "cors";
dotenv.config();
const app = express()
app.use(cors({
  origin: "*",
  methods: "GET, POST, PUT, PATCH, DELETE",
  credentials: true
}))
app.use("/", Main)



app.listen(8000, () => {
  console.log("running")
})
