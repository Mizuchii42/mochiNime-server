import express from "express";

const app = express()

app.get("/", (req, res) => {
  res.json({
    message: "testing server"
  })
})

app.addListener(3000, () => {
  console.log("running")
})
