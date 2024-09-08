import axios from "axios";

// Function to fetch the movie poster URL from OMDb API
async function fetchPosterUrl(movieTitle) {
  const apiKey = process.env.OMDBKEY;
  const url = `http://www.omdbapi.com/?t=${encodeURIComponent(
    movieTitle
  )}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const movieData = response.data;

    if (movieData.Response === "True") {
      return movieData.Poster; // Return the poster URL
    } else {
      console.log(`Movie not found: ${movieTitle}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching poster URL:", error);
    return null;
  }
}

// Function to fetch the movie poster URL from OMDb API
async function fetchMovieData(movieTitle) {
  const apiKey = process.env.OMDBKEY;
  const url = `http://www.omdbapi.com/?t=${encodeURIComponent(
    movieTitle
  )}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const movieData = response.data;

    if (movieData.Response === "True") {
      console.log(movieData);
      return movieData; // Return the movie data
    } else {
      console.log(`Movie not found: ${movieTitle}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
}

export { fetchPosterUrl, fetchMovieData };
