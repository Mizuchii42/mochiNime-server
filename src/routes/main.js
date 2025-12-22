import express from "express";
import { home } from "../controller/home.js";
import { viewPage } from "../controller/pageView.js";
import { stream } from "../controller/striming.js";
const Main = express.Router();

Main.get("/home", (req, res) => {
  try {
    home(req, res);
  } catch (err) {
    console.log(err);
  }
})
Main.get("/search/:nama", (req, res) => {
  try {
    const { nama } = req.params;
  } catch (err) {
    console.log(err)
  }
})

Main.get("/view/:id", (req, res) => {
  try {
    const { id } = req.params
    viewPage(req, res, id);
  } catch (err) {
    console.log(err)
  }
})
Main.get("/striming/:url", (req, res) => {
  try {
    stream(req, res)
  } catch (err) {
    console.log(err);
  }
})

export default Main;
