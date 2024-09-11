# MINI MOVIE INVENTORY MANAGEMENT APP

A webapp (CRUD) where you can manage movies, genres and directors.

## What I learned

This was a student project for learning the basics of developing a CRUD webapp. Most interesting was setting up and managing databases and tables with many-to-many relationship. For example I have tables for movies and genres. But also a table called movie_genres that manages the many-to-many relationship between movies and genres. So a movie can have more then 1 genre associated with it. And when deleting a movie, the genre associated in the m-t-m table also gets it deleted using Postgres ON DELETE CASCADE clause.

## Techniques used

- NODE
- ExpressJS
- Postgres
- Node-Postgres (Modules for interfacing with PostgreSQL)
- ExpressEJS Layouts (templating front-end)
- Express-validator (Validating SQL queries on backend)
- Axios (API calls)

## Challenges faced while developing

The scope of the project got a little bit out of hand. You start to respect professional developer life a bit more after doing a CRUD app. It probably has some bugs but I started getting tired so... Search functionality was never implemented. Front-end styling and responsiveness needs some work.

## Some novel ideas

Instead of filling all the details for a movie manually. I used OMDb api to fetch and populate the common fields such as year released and its genre's. You are left with only filling your rating of the movie and a description/review.

## What is this app good for

Managing your favorite movies. Could be developed further into a sort of watchlist app where you keep track of all movies you have watched or want to watch. But that is out of scope.

## Future improvements

- List director name on single movie view
- Require password for delete
- Front-end styling in general need of more work.
- If database gets very large there could be UX and UI issues on the front-end. Features like pagination would need to be implemented for managing large datasets.
