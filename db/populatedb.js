#! /usr/bin/env node

import pkg from "pg";

const { Client } = pkg;

const SQL = `
CREATE TABLE IF NOT EXISTS directors (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  f_name TEXT,
  l_name TEXT,
  UNIQUE (f_name, l_name)
);

CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    year_released INT,
    director_id INT REFERENCES directors(id),
    runtime INT,
    age_rating TEXT,
    rating FLOAT,
    descr TEXT,
    poster_url TEXT
);

CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id INT REFERENCES movies(id) ON DELETE CASCADE,
    genre_id INT REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

INSERT INTO directors (f_name, l_name) VALUES
('Steven', 'Spielberg'),
('Christopher', 'Nolan'),
('Quentin', 'Tarantino'),
('Martin', 'Scorsese'),
('James', 'Cameron'),
('Alfred', 'Hitchcock'),
('Stanley', 'Kubrick'),
('Ridley', 'Scott'),
('Peter', 'Jackson'),
('Francis', 'Ford Coppola'),
('Guillermo', 'del Toro'),
('David', 'Fincher'),
('Wes', 'Anderson'),
('Tim', 'Burton'),
('Denis', 'Villeneuve');

INSERT INTO genres (name, slug) VALUES
('Action', 'action'),
('Adventure', 'adventure'),
('Animation', 'animation'),
('Biography', 'biography'),
('Comedy', 'comedy'),
('Crime', 'crime'),
('Drama', 'drama'),
('Fantasy', 'fantasy'),
('History', 'history'),
('Horror', 'horror'),
('Musical', 'musical'),
('Mystery', 'mystery'),
('Romance', 'romance'),
('Sci-Fi', 'sci-fi'),
('Thriller', 'thriller'),
('Western', 'western');

INSERT INTO movies (title, slug, year_released, director_id, runtime, age_rating, rating, descr, poster_url) VALUES
('Inception', 'inception', 2010, 2, 148, 'PG-13', 8.8, 'A thief with the ability to enter peoples dreams takes on the ultimate heist.', 'https://m.media-amazon.com/images/M/MV5BMmFjZTI1NzAtYTg4Ni00ZTJkLTk0NjktZjMzZDFmNzA0ZDhlXkEyXkFqcGdeQXVyNzY1NDgwNjQ@._V1_SX300.jpg'),
('Jurassic Park', 'jurassic-park', 1993, 1, 127, 'PG-13', 8.1, 'A pragmatic paleontologist visits an almost complete theme park and is tasked with protecting two kids after a power failure causes the parks cloned dinosaurs to run loose.', 'https://m.media-amazon.com/images/M/MV5BZTdiZjRjNmYtNDg2ZS00YTIxLTlkODMtMzY5NjZjZTUzMGIxXkEyXkFqcGdeQXVyNjUyNzYzNzA@._V1_SX300.jpg'),
('Pulp Fiction', 'pulp-fiction', 1994, 3, 154, 'R', 8.9, 'The lives of two mob hitmen, a boxer, a gangster''s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 'https://m.media-amazon.com/images/M/MV5BZWU0ZjczYjQtYzQzYy00MzI4LTg1ZTktMDFlZmY2MjFiOWEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg'),
('The Dark Knight', 'the-dark-knight', 2008, 2, 152, 'PG-13', 9.0, 'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.', 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMDMzMw@@._V1_SX300.jpg'),
('The Godfather', 'the-godfather', 1972, 9, 175, 'R', 9.2, 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwOC00ZjQwLTlkNTEtNGJmYzNlZTcwODMxXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg'),
('Avatar', 'avatar', 2009, 5, 162, 'PG-13', 7.8, 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.', 'https://m.media-amazon.com/images/M/MV5BMjEzMjg4NDY5OV5BMl5BanBnXkFtZTgwMTU2NTIzMDE@._V1_SX300.jpg'),
('Fight Club', 'fight-club', 1999, 12, 139, 'R', 8.8, 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.', 'https://m.media-amazon.com/images/M/MV5BMmEzNjI0NDYtYzFjZS00ZjY2LWEzM2EtZWFjMDZmOWYwNjYxXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg'),
('The Shining', 'the-shining', 1980, 7, 146, 'R', 8.4, 'A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence.', 'https://m.media-amazon.com/images/M/MV5BZGViNTk2ZDAtMmM0NS00ZTM1LThmOTQtOTYzMzA5MTE3OTBiXkEyXkFqcGdeQXVyNjUxMDQ0MTg@._V1_SX300.jpg'),
('Pans Labyrinth', 'pans-labyrinth', 2006, 10, 118, 'R', 8.2, 'In the aftermath of the Spanish Civil War, young Ofelia meets a mythical faun who sets her on a quest.', 'https://m.media-amazon.com/images/M/MV5BMjU4Mjk2NDk5OF5BMl5BanBnXkFtZTcwOTcxOTM0Mw@@._V1_SX300.jpg'),
('Blade Runner 2049', 'blade-runner-2049', 2017, 15, 164, 'R', 8.0, 'Young Blade Runner K''s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who has been missing for thirty years.', 'https://m.media-amazon.com/images/M/MV5BMjU4ZWI0ODktNTBiZi00M2ZmLTgwMTUtNzZkNmM0MTc4ZTE0XkEyXkFqcGdeQXVyNzgxODU1NDg@._V1_SX300.jpg');

INSERT INTO movie_genres (movie_id, genre_id) VALUES
(1, 1),
(1, 14),
(2, 1),
(2, 2),
(2, 9),
(3, 6),
(3, 7),
(3, 15),
(4, 1),
(4, 6),
(4, 7),
(5, 6),
(5, 7),
(6, 1),
(6, 2),
(6, 14),
(7, 7),
(7, 15),
(8, 10),
(8, 7),
(9, 7),
(9, 8),
(10, 14),
(10, 12);
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
