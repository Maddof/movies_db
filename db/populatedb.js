#! /usr/bin/env node

import pkg from "pg";

const { Client } = pkg;

const SQL = `
CREATE TABLE IF NOT EXISTS directors (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  f_name TEXT,
  l_name TEXT
);

CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    year_released INT,
    director_id INT REFERENCES directors(id),
    runtime INT,
    age_rating TEXT,
    rating FLOAT
);

CREATE TABLE movie_genres (
    movie_id INT REFERENCES movies(id) ON DELETE CASCADE,
    genre_id INT REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

INSERT INTO directors (f_name, l_name) VALUES
('Steven', 'Spielberg'),
('Christopher', 'Nolan'),
('Quentin', 'Tarantino'),
('Martin', 'Scorsese'),
('James', 'Cameron');

INSERT INTO genres (name, slug) VALUES
('Action', 'action'),
('Drama', 'drama'),
('Sci-Fi', 'sci-fi'),
('Thriller', 'thriller'),
('Adventure', 'adventure');

INSERT INTO movies (title, slug, year_released, director_id, runtime, age_rating, rating) VALUES
('Jurassic Park', 'jurassic-park', 1993, 1, 127, 'PG-13', 8.1),
('Inception', 'inception', 2010, 2, 148, 'PG-13', 8.8),
('Pulp Fiction', 'pulp-fiction', 1994, 3, 154, 'R', 8.9),
('The Wolf of Wall Street', 'the-wolf-of-wall-street', 2013, 4, 180, 'R', 8.2),
('Avatar', 'avatar', 2009, 5, 162, 'PG-13', 7.8);

INSERT INTO movie_genres (movie_id, genre_id) VALUES
(1, 1),
(1, 5),
(2, 3),
(2, 4),
(3, 2),
(3, 4),
(4, 2),
(5, 3),
(5, 5);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main().catch((err) => console.error(err));
