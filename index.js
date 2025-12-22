import express from "express";

const app = express()

app.get("/", (req, res) => {
  res.json({
    message: "testing server"
  })
})

app.listen(3000, () => {
  console.log("running")
})
