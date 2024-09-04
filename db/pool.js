import pg from "pg";
const { Pool } = pg;

// pools will use environment variables
// for connection information
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const checkDatabaseConnection = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Could not connect to the database:", err);
    process.exit(1); // Exit the application with an error code
  }
};

checkDatabaseConnection();

export { pool };
