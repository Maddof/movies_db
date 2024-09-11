import { view, insert, deleteM, editM } from "../db/queries.js";
import { director } from "../db/queriesDirectors.js";
import { fetchMovieData } from "../api.js";
import { generateSlug } from "../utils/slugGenerator.js";
import { validationResult } from "express-validator";
import { validateMovie } from "./validations.js";

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
// @route GET /addmovie
const renderAddMovie = async (req, res, next) => {
  try {
    const alldirectors = await director.getAllDirectors();
    res.render("addMovie", {
      title: "Add movie",
      alldirectors: alldirectors,
      moviedata: null, // Initial form state without movie data
      errors: null, // No errors initially
      success: null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Render edit movie page
// @route GET /movie/edit/:slug
const renderEditMovie = async (req, res, next) => {
  const movieSlug = req.params.slug;
  const movieDirector = await director.getMovieDirectorByMovieSlug(movieSlug);
  try {
    const alldirectors = await director.getAllDirectors();
    const movieData = await view.getMovieBySlug(movieSlug);
    const movieGenres = await view.getMovieGenresBySlug(movieSlug);
    res.render("editMovie", {
      title: "Edit movie",
      alldirectors: alldirectors,
      movieDirector: movieDirector,
      moviedata: movieData,
      moviegenres: movieGenres,
      errors: null,
      success: null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Edit Single Movie
// @route POST /editmovie
const editSingleMovie = [
  validateMovie,
  async (req, res, next) => {
    const alldirectors = await director.getAllDirectors();
    const movieDirector = await director.getMovieDirectorByMovieSlug(
      req.body.slug
    );
    const movieData = {
      title: req.body.title,
      slug: req.body.slug,
      year_released: parseInt(req.body.year_released),
      director_id: parseInt(req.body.director_id),
      runtime: parseInt(req.body.runtime),
      age_rating: req.body.age_rating,
      rating: parseFloat(req.body.rating),
      descr: req.body.description,
    };
    const movieId = await view.getMovieIdBySlug(req.body.slug);
    let movieGenres = await view.getMovieGenresBySlug(req.body.slug);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("editMovie", {
        title: "Error with adding movie",
        alldirectors: alldirectors,
        movieDirector: movieDirector,
        errors: errors.array(),
        moviedata: movieData,
        moviegenres: movieGenres,
      });
    }

    await editM.editSingleMovie(movieData, req.body.genres, movieId);
    movieGenres = await view.getMovieGenresBySlug(req.body.slug);

    // After successful insertion, pass a success message
    return res.status(201).render("editMovie", {
      title: "Edit movie",
      success: "Movie updated successfully!",
      alldirectors: alldirectors,
      movieDirector: movieDirector,
      moviedata: movieData, // Reset the form after success
      moviegenres: movieGenres,
    });
  },
];

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
// @route GET /movie/:slug
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
// @route POST /new
const insertMovie = [
  validateMovie,
  async (req, res, next) => {
    const alldirectors = await director.getAllDirectors();
    const movieData = {
      title: req.body.title,
      slug: req.body.slug,
      year_released: parseInt(req.body.year_released),
      director_id: parseInt(req.body.director_id),
      runtime: parseInt(req.body.runtime),
      age_rating: req.body.age_rating,
      rating: parseFloat(req.body.rating),
      description: req.body.description,
      genres: req.body.genres,
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("addMovie", {
        title: "Error with adding movie",
        alldirectors: alldirectors,
        errors: errors.array(),
        moviedata: movieData,
      });
    }
    await insert.insertMovie(movieData);

    // After successful insertion, pass a success message
    return res.status(201).render("addMovie", {
      title: "Add movie",
      success: "Movie added successfully!",
      alldirectors: alldirectors,
      moviedata: null, // Reset the form after success
    });
  },
];

// @desc Delete single movie
// @route POST /deletemovie

const deleteSingleMovie = async (req, res, next) => {
  const movieSlug = req.body.movieslug;
  try {
    const result = await deleteM.deleteSingleMovie(movieSlug);
    res.render("index", {
      title: "Homepage",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Fetch movie data from OMDb api
// @route GET /fetchmoviedata
const searchMovieData = async (req, res, next) => {
  const movieData = await fetchMovieData(req.query.titlesearch);
  const alldirectors = await director.getAllDirectors();

  const movieCustomData = {
    title: movieData.Title,
    slug: generateSlug(movieData.Title),
    year_released: parseInt(movieData.Year),
    age_rating: movieData.Rated,
    runtime: parseInt(movieData.Runtime.split(" ")[0]),
    genres: movieData.Genre.split(", "),
  };
  res.render("addMovie", {
    title: "Add movie",
    moviedata: movieCustomData,
    alldirectors: alldirectors,
  });
};

export {
  renderIndex,
  renderAbout,
  renderSingleGenre,
  renderSingleMovie,
  renderEditMovie,
  editSingleMovie,
  insertMovie,
  renderAddMovie,
  searchMovieData,
  deleteSingleMovie,
};
