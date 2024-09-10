import express from "express";
import {
  renderIndex,
  renderAbout,
  renderSingleGenre,
  renderSingleMovie,
  renderAddMovie,
  renderEditMovie,
  insertMovie,
  inserDirector,
  searchMovieData,
  renderSingleDirector,
  renderAddDirector,
  deleteSingleMovie,
  editSingleMovie,
} from "../controllers/moviesController.js";
import {
  fetchGenresForViews,
  fetchTopDirectors,
} from "../middleware/globals.js";

const router = express.Router();

router.use(fetchGenresForViews);
router.use(fetchTopDirectors);

router.post("/deletemovie", deleteSingleMovie);

router.get("/", renderIndex);
router.get("/about", renderAbout);
router.get("/addmovie", renderAddMovie);
router.get("/addDirector", renderAddDirector);
router.get("/genre/:slug", renderSingleGenre);
router.get("/director/:id", renderSingleDirector);
router.get("/movie/edit/:slug", renderEditMovie);

router.get("/fetchmoviedata", searchMovieData);

router.get("/movie/:slug", renderSingleMovie);
router.post("/new", insertMovie);
router.post("/newdirector", inserDirector);
router.post("/editmovie", editSingleMovie);

export { router };
