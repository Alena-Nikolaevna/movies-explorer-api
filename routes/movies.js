const movieRouter = require('express').Router();
const { createMovieValidation, movieIdValidation } = require('../middlewares/validations');

const {
  createMovie, getMovies, deleteMovie,
} = require('../controllers/movies');

movieRouter.post('/', createMovieValidation, createMovie); // POST /movies — создаёт фильм с переданными в теле:
// country, director, duration, year, description, image,
// trailer, nameRU, nameEN и thumbnail, movieId.

movieRouter.get('/', getMovies); // GET /movies — возвращает все сохранённые текущим пользователем фильмы
movieRouter.delete('/:movieId', movieIdValidation, deleteMovie); // DELETE /movies/_id — удаляет сохранённый фильм по id

module.exports = movieRouter;

//
// # возвращает все сохранённые текущим пользователем фильмы
// GET /movies

// # создаёт фильм с переданными в теле
// country, director, duration, year, description, image,
// trailer, nameRU, nameEN и thumbnail, movieId
// POST /movies

// # удаляет сохранённый фильм по id
// DELETE /movies/_id
