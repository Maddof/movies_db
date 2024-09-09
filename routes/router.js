import express from "express";
import {
  renderIndex,
  renderAbout,
  renderSingleGenre,
  renderSingleMovie,
  renderAddMovie,
  insertMovie,
  inserDirector,
  searchMovieData,
  renderSingleDirector,
  renderAddDirector,
} from "../controllers/moviesController.js";
import {
  fetchGenresForViews,
  fetchTopDirectors,
} from "../middleware/globals.js";

const router = express.Router();

router.use(fetchGenresForViews);
router.use(fetchTopDirectors);

router.get("/", renderIndex);
router.get("/about", renderAbout);
router.get("/addmovie", renderAddMovie);
router.get("/addDirector", renderAddDirector);
router.get("/genre/:slug", renderSingleGenre);
router.get("/director/:id", renderSingleDirector);

router.get("/fetchmoviedata", searchMovieData);

router.get("/movie/:slug", renderSingleMovie);
router.post("/new", insertMovie);
router.post("/newdirector", inserDirector);

export { router };
