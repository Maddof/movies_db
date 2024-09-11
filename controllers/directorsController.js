import { director } from "../db/queriesDirectors.js";
import { validationResult } from "express-validator";
import { validateDirector } from "./validations.js";

// @desc Render add director page
// @route GET /addDirector
const renderAddDirector = async (req, res, next) => {
  try {
    res.render("addDirector", {
      title: "Add director",
      errors: null,
      success: null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Insert new director
// @route POST /newdirector
const inserDirector = [
  validateDirector,
  async (req, res, next) => {
    const directorData = {
      f_name: req.body.f_name,
      l_name: req.body.l_name,
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("addDirector", {
        title: "Error with adding director",
        errors: errors.array(),
      });
    }

    // Check if the director already exists
    const existingDirector = await director.findDirectorByName(
      directorData.f_name,
      directorData.l_name
    );

    if (existingDirector) {
      // If the director exists, send an error
      return res.status(400).render("addDirector", {
        title: "Error with adding director",
        errors: [{ msg: "Director already exists" }],
      });
    }

    // If no director exists, add the new director
    await director.addNewDirector(directorData);

    return res.status(201).render("addDirector", {
      title: "Add director",
      success: "Director added successfully!",
    });
  },
];

// @desc View single director
// @route GET /director/:id
const renderSingleDirector = async (req, res, next) => {
  const directorId = req.params.id;
  const moviesPerDirector = await director.getMoviesByDirector(directorId);
  res.render("singleDirector", {
    title: moviesPerDirector[0].name,
    movies: moviesPerDirector,
  });
};

export { renderAddDirector, inserDirector, renderSingleDirector };
