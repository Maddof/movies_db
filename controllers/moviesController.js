import { view } from "../db/queries.js";

// @desc Render all genres (index)
// @route GET
const renderIndex = async (req, res, next) => {
  console.log("Rendering index");
  res.render("index");
};

// @desc Render about page
// @route GET
const renderAbout = async (req, res, next) => {
  console.log("Rendering about");
  res.render("about");
};

// @desc View single genre
// @route GET /genres/:slug
const renderSingleGenre = async (req, res, next) => {
  const genreSlug = req.params.slug;
  const moviesPerGenre = await view.getMoviesPerGenre(genreSlug);
  const genreName = await view.getGenreNameBySlug(genreSlug);
  res.render("singleCategory", {
    title: "Genre",
    movies: moviesPerGenre,
    genreName: genreName,
  });
};

export { renderIndex, renderAbout, renderSingleGenre };
