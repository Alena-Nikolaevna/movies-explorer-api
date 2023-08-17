const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError'); // 404 ошибка
const ForbiddenError = require('../errors/ForbiddenError'); // 403 ошибка
const BadRequestError = require('../errors/BadRequestError'); // 400 ошибка

// создаёт фильм
const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

// возвращает все фильмы, сохранённые текущим пользователем
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

// удаляет карточку по идентификатору
const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден.');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('В доступе отказано. Удалить чужой фильм нельзя.');
      } else {
        Movie.deleteOne(movie)
          .then(() => {
            res.send({ message: 'Фильм удален.' });
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
