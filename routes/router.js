import express from "express";
import {
  renderIndex,
  renderAbout,
  renderSingleGenre,
  renderSingleMovie,
  renderAddMovie,
  insertMovie,
  searchMovieData,
} from "../controllers/moviesController.js";
import { fetchGenresForViews } from "../middleware/globals.js";

const router = express.Router();

router.use(fetchGenresForViews);

router.get("/", renderIndex);
router.get("/about", renderAbout);
router.get("/addmovie", renderAddMovie);
router.get("/genre/:slug", renderSingleGenre);

router.get("/fetchmoviedata", searchMovieData);

router.get("/movie/:slug", renderSingleMovie);
router.post("/new", insertMovie);
export { router };
