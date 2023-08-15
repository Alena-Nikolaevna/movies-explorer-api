const mongoose = require('mongoose');
const validator = require('validator');

// Поля схемы сохранённого фильма
const movieSchema = new mongoose.Schema({

  country: { // страна создания фильма
    type: String,
    required: true,
  },
  director: { // режиссёр фильма
    type: String,
    required: true,
  },
  duration: { // длительность фильма
    type: Number,
    required: true,
  },
  year: { // год выпуска фильма
    type: String,
    required: true,
  },
  description: { // описание фильма
    type: String,
    required: true,
  },
  image: { // ссылка на постер к фильму
    type: String,
    required: true,
    validate: {
      validator: (link) => validator.isURL(link),
      message: 'Некорректная ссылка URL',
    },
  },
  trailerLink: { // ссылка на трейлер фильма
    type: String,
    required: true,
    validate: {
      validator: (link) => validator.isURL(link),
      message: 'Некорректная ссылка URL',
    },
  },
  thumbnail: { // миниатюрное изображение постера к фильму
    type: String,
    required: true,
    validate: {
      validator: (link) => validator.isURL(link),
      message: 'Некорректная ссылка URL',
    },
  },
  owner: { // owner — _id пользователя, который сохранил фильм
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: { // — id фильма, который содержится в ответе сервиса MoviesExplorer
    type: Number,
    required: true,
  },
  nameRU: { // название фильма на русском языке
    type: String,
    required: true,
  },
  nameEN: { // название фильма на английском языке
    type: String,
    required: true,
  },
});

/* likes: [{ // likes — список лайкнувших пост пользователей
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  ref: 'user',
  default: [],
}], */
/* createdAt: { // createdAt — дата создания
   type: Date,
   // required: true,
   default: Date.now,
 }, */

const Movie = mongoose.model('movie', movieSchema);
module.exports = Movie;
