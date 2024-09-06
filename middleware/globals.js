import { view } from "../db/queries.js";

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

export { fetchGenresForViews };
