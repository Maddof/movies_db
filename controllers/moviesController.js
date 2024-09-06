import { view } from "../db/queries.js";

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

export { renderIndex, renderAbout, renderSingleGenre, renderSingleMovie };
