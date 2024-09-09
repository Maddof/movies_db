import { view } from "../db/queries.js";
import { director } from "../db/queriesDirectors.js";

// Middleware to fetch genres for all views
const fetchGenresForViews = async (req, res, next) => {
  try {
    const moviegenreswithcount = await view.getAllGenresWithCount();
    res.locals.genres = moviegenreswithcount; // Store in res.locals to make it accessible in all views
    next(); // Call next to move on to the next middleware or route handler
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};

const fetchTopDirectors = async (req, res, next) => {
  try {
    const directorswithcount = await director.getTopDirectors();
    console.log(directorswithcount);
    res.locals.directors = directorswithcount;
    next();
  } catch (error) {
    next(error);
  }
};

export { fetchGenresForViews, fetchTopDirectors };
