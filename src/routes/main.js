import express from "express";
import { home } from "../controller/home.js";
import { viewPage } from "../controller/pageView.js";
import { stream } from "../controller/striming.js";
import { search } from "../controller/search.js";
import { genreSection } from "../controller/genre.js";
const Main = express.Router();
Main.get("/", (req, res) => {
  res.json({
    developer: "Mizuchii42",
    github: "https://github.com/Mizuchii42",
    docs: [
      {
        path: "/home",
        desc: "mengambil data anime beberapa"
      },
      {
        path: "/search/:name",
        desc: "untuk mencari anime berdasarkan nama"
      },
      {
        path: "/view/:link",
        desc: "melihat detail anime dan daftar episode"
      },
      {
        path: "/genre/:id",
        desc: "memunculkan daftar anime berdasarkan genre"
      },
      {
        path: "/striming/:plink",
        desc: "untuk menampilkan link striming dari anime yang di pilih"
      }
    ]

  })
})
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
    search(req, res, nama);
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

Main.get("/genre/:slug", (req, res) => {
  genreSection(req, res);
})

export default Main;
