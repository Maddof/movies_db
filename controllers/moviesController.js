import { view, insert } from "../db/queries.js";
import { fetchMovieData } from "../api.js";
import { generateSlug } from "../utils/slugGenerator.js";
import { body, validationResult } from "express-validator";

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

// @desc Render all genres (index)
// @route GET
const renderIndex = async (req, res, next) => {
  res.render("index", { title: "Homepage" });
};

// @desc Render about page
// @route GET
const renderAbout = async (req, res, next) => {
  res.render("about", { title: "About us" });
};

// @desc Render add movie page
// @route GET
const renderAddMovie = async (req, res, next) => {
  try {
    res.render("addMovie", {
      title: "Add movie",
      moviedata: null, // Initial form state without movie data
      errors: null, // No errors initially
      success: null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc View single genre
// @route GET /genres/:slug
const renderSingleGenre = async (req, res, next) => {
  const genreSlug = req.params.slug;
  const moviesPerGenre = await view.getMoviesPerGenre(genreSlug);
  const genreName = await view.getGenreNameBySlug(genreSlug);
  res.render("singleCategory", {
    title: genreName + " Movies",
    movies: moviesPerGenre,
    genreName: genreName,
  });
};

// @desc View single movie
// @route GET /genres/:slug
const renderSingleMovie = async (req, res, next) => {
  const movieSlug = req.params.slug;
  const movie = await view.getMovieBySlug(movieSlug);
  const movieGenres = await view.getMovieGenresBySlug(movieSlug);
  res.render("singleMovie", {
    title: movie.title,
    movie: movie,
    movieGenres: movieGenres,
  });
};

// @desc Insert new movie
// @route  POST /new
const insertMovie = [
  validateMovie,
  async (req, res, next) => {
    const movieData = {
      title: req.body.title,
      slug: req.body.slug,
      year_released: parseInt(req.body.year_released),
      director_id: parseInt(req.body.director_id),
      runtime: parseInt(req.body.runtime),
      age_rating: req.body.age_rating,
      rating: parseFloat(req.body.rating),
      genres: req.body.genres,
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("addMovie", {
        title: "Error with adding movie",
        errors: errors.array(),
        moviedata: movieData,
      });
    }
    await insert.insertMovie(movieData);

    // After successful insertion, pass a success message
    return res.status(201).render("addMovie", {
      title: "Add movie",
      success: "Movie added successfully!",
      moviedata: null, // Reset the form after success
    });
  },
];

const searchMovieData = async (req, res, next) => {
  const movieData = await fetchMovieData(req.query.titlesearch);

  const movieCustomData = {
    title: movieData.Title,
    slug: generateSlug(movieData.Title),
    year_released: parseInt(movieData.Year),
    age_rating: movieData.Rated,
    runtime: parseInt(movieData.Runtime.split(" ")[0]),
    genres: movieData.Genre.split(", "),
  };
  console.log(movieCustomData);
  res.render("addMovie", { title: "Add movie", moviedata: movieCustomData });
};

export {
  renderIndex,
  renderAbout,
  renderSingleGenre,
  renderSingleMovie,
  insertMovie,
  renderAddMovie,
  searchMovieData,
};
