import { pool } from "./pool.js";

const view = {
  async getAllGenres() {
    const { rows } = await pool.query("SELECT * FROM genres");
    return rows;
  },

  async getAllGenresWithCount() {
    const query = `
        SELECT g.slug AS slug, g.name AS name, COUNT(mg.movie_id) AS count
        FROM genres g
        LEFT JOIN movie_genres mg ON g.id = mg.genre_id
        GROUP BY g.name, g.slug;
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

  // Function to get movie genres by slug
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

export { view };
