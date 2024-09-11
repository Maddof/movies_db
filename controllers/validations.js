import { body } from "express-validator";

const validateMovie = [
  body("title")
    .isLength({ min: 1, max: 100 })
    .withMessage(`Title must be between 1 and 100 characters`),
  body("slug")
    .isSlug()
    .withMessage("Slug must be alphanumeric with optional hyphens"),
  body("year_released")
    .isInt({ min: 1888, max: new Date().getFullYear() })
    .withMessage("Year released must be a valid year"),
  body("director_id")
    .isInt({ min: 1 })
    .withMessage("Director ID must be a positive integer"),
  body("runtime")
    .isInt({ min: 1 })
    .withMessage("Runtime must be a positive integer"),
  body("age_rating")
    .isIn(["G", "PG", "PG-13", "R", "NC-17"])
    .withMessage("Age rating must be one of: G, PG, PG-13, R, NC-17"),
  body("rating")
    .isFloat({ min: 0, max: 10 })
    .withMessage("Rating must be a number between 0 and 10"),
  body("genres").notEmpty().withMessage("Select at least 1 genre"),
];

const validateDirector = [
  body("f_name")
    .isLength({ min: 1, max: 100 })
    .withMessage("First name must be between 1 and 100 characters"),
  body("l_name")
    .isLength({ min: 1, max: 100 })
    .withMessage("First name must be between 1 and 100 characters"),
];

export { validateMovie, validateDirector };
