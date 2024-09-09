import { pool } from "./pool.js";

const director = {
  async getAllDirectors() {
    const query = `
        SELECT d.id AS id, CONCAT(d.f_name, ' ', d.l_name) AS name
        FROM directors d
        ORDER BY name
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  async getTopDirectors() {
    const query = `
        SELECT d.id AS id, CONCAT(d.f_name, ' ', d.l_name) AS name, COUNT(m.id) AS count
        FROM directors d
        LEFT JOIN movies m ON d.id = m.director_id
        GROUP BY d.id
        HAVING COUNT(m.id) > 0
        ORDER BY count DESC
        LIMIT 10;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  async getMoviesByDirector(directorId) {
    const query = `
        SELECT d.id, CONCAT(d.f_name, ' ', d.l_name) AS name, m.title, m.slug
        FROM directors d
        JOIN movies m ON d.id = m.director_id
        WHERE d.id = $1
    `;
    const { rows } = await pool.query(query, [directorId]);
    return rows;
  },

  async addNewDirector(director) {
    const f_name = director.f_name;
    const l_name = director.l_name;

    const insertDirectorQ = `
    INSERT INTO directors (f_name, l_name)
    VALUES ($1, $2)
    RETURNING id;
    `;

    try {
      const result = await pool.query(insertDirectorQ, [f_name, l_name]);

      const directorId = result.rows[0].id;
      console.log("Movie insert: ", result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error("Error inserting director:", error);
    }
  },

  // Find a director by first and last name
  async findDirectorByName(f_name, l_name) {
    const result = await pool.query(
      "SELECT * FROM directors WHERE f_name = $1 AND l_name = $2",
      [f_name, l_name]
    );
    return result.rows[0]; // Return the director if found, otherwise undefined
  },
};

export { director };
