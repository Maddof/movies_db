import express from "express";
import {
  renderIndex,
  renderAbout,
  renderSingleGenre,
} from "../controllers/moviesController.js";
import { fetchGenresForViews } from "../middleware/globals.js";

const router = express.Router();

router.use(fetchGenresForViews);

router.get("/", renderIndex);
router.get("/about", renderAbout);
router.get("/genre/:slug", renderSingleGenre);

export { router };
