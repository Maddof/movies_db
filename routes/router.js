import express from "express";
import { renderIndex } from "../controllers/moviesController.js";

const router = express.Router();

router.get("/", renderIndex);

export { router };
