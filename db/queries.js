import { pool } from "./pool.js";
import { fetchPosterUrl } from "../api.js";

const view = {
  async getAllGenres() {
    const { rows } = await pool.query("SELECT * FROM genres ORDER BY name");
    return rows;
  },

  async getAllGenresWithCount() {
    const query = `
        SELECT g.id AS id, g.slug AS slug, g.name AS name, COUNT(mg.movie_id) AS count
        FROM genres g
        LEFT JOIN movie_genres mg ON g.id = mg.genre_id
        GROUP BY g.name, g.slug, g.id
        ORDER BY g.name;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  async getMoviesPerGenre(genreSlug) {
    const query = `
        SELECT
          m.title, 
          m.year_released, 
          m.runtime, 
          m.age_rating, 
          m.rating,
          m.slug,
          d.f_name AS director_first_name,
          d.l_name AS director_last_name,
          ARRAY_AGG(g.name) AS genres
        FROM 
          movies m
        JOIN 
          movie_genres mg ON m.id = mg.movie_id
        JOIN 
          genres g ON mg.genre_id = g.id
        JOIN 
          directors d ON m.director_id = d.id
        WHERE 
          g.slug = $1
        GROUP BY
          m.id, d.f_name, d.l_name;
    `;
    const { rows } = await pool.query(query, [genreSlug]);
    return rows;
  },

  // Function to get genre name by slug
  async getGenreNameBySlug(genreSlug) {
    const query = `SELECT name FROM genres WHERE slug = $1`;
    const { rows } = await pool.query(query, [genreSlug]);
    return rows[0] ? rows[0].name : null; // Return genre name or null if not found
  },

  // Function to movie by slug
  async getMovieBySlug(movieSlug) {
    const query = `SELECT * FROM movies WHERE slug = $1`;
    const { rows } = await pool.query(query, [movieSlug]);
    return rows[0] ? rows[0] : null; // Return row or null if not found
  },

  // Function to get movie id by slug
  async getMovieIdBySlug(movieSlug) {
    const query = `SELECT id FROM movies WHERE slug = $1`;
    const { rows } = await pool.query(query, [movieSlug]);
    return rows[0].id ? rows[0].id : null; // Return row or null if not found
  },

  // Function to get movie genres by movie slug
  async getMovieGenresBySlug(movieSlug) {
    const query = `
      SELECT
        ARRAY_AGG(g.name) AS genres
      FROM
        movies m 
      JOIN
        movie_genres mg ON m.id = mg.movie_id
      JOIN
        genres g ON mg.genre_id = g.id
      WHERE m.slug = $1;
      `;
    const { rows } = await pool.query(query, [movieSlug]);
    return rows[0] ? rows[0].genres : null;
  },
};

const insert = {
  // Function to insert a movie with poster URL
  async insertMovie(movieData) {
    const {
      title,
      slug,
      year_released,
      director_id,
      runtime,
      age_rating,
      rating,
      description,
    } = movieData;

    // Fetch the poster URL from OMDb API
    const posterUrl = await fetchPosterUrl(title);

    // SQL query to insert the movie data into the database
    const insertMovieQ = `
    INSERT INTO movies (title, slug, year_released, director_id, runtime, age_rating, rating, descr, poster_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id;
  `;

    // Insert movie data including the poster URL
    try {
      const result = await pool.query(insertMovieQ, [
        title,
        slug,
        year_released,
        director_id,
        runtime,
        age_rating,
        rating,
        description,
        posterUrl,
      ]);

      const movieId = result.rows[0].id;
      console.log("Movie inserted:", result.rows[0]);

      const insertGenreQuery = `
      INSERT INTO movie_genres (movie_id, genre_id)
      VALUES ($1, $2);
    `;

      for (const genreId of movieData.genres) {
        await pool.query(insertGenreQuery, [movieId, genreId]);
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error inserting movie:", error);
    }
  },
};

const deleteM = {
  async deleteSingleMovie(movieSlug) {
    const deleteMovieQ = `
      DELETE FROM movies WHERE slug = $1;
    `;
    const result = await pool.query(deleteMovieQ, [movieSlug]);
    console.log("Success, ", result.rowCount, " movies deleted");
    return result.rows[0];
  },
};

const editM = {
  async editSingleMovie(movieData, moviegenres, id) {
    const {
      title,
      slug,
      year_released,
      director_id,
      runtime,
      age_rating,
      rating,
      descr,
    } = movieData;

    const movieGenres = moviegenres;
    const movieId = id;

    // SQL query to update the movie data in the database
    const editMovieQ = `
      UPDATE movies
      SET title         = $1,
          slug          = $2,
          year_released = $3,
          director_id   = $4,
          runtime       = $5,
          age_rating    = $6,
          rating        = $7,
          descr         = $8
      WHERE id = $9;
    `;

    // SQL query to delete existing genres for the movie
    const deleteGenresQ = `
      DELETE FROM movie_genres
      WHERE movie_id = $1;
        `;
    // SQL query to insert updated genres for the movie
    const insertGenreQ = `
      INSERT INTO movie_genres (movie_id, genre_id)
      VALUES ($1, $2);
      `;

    try {
      const result = await pool.query(editMovieQ, [
        title,
        slug,
        year_released,
        director_id,
        runtime,
        age_rating,
        rating,
        descr,
        movieId,
      ]);

      console.log("Success movie edited");

      // Delete existing genres for the movie
      await pool.query(deleteGenresQ, [movieId]);

      // Insert new genres
      for (const genreId of movieGenres) {
        await pool.query(insertGenreQ, [movieId, genreId]);
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  },
};

export { view, insert, deleteM, editM };
