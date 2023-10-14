const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError'); // 404 ошибка
const ConflictError = require('../errors/ConflictError'); // 409
const BadRequestError = require('../errors/BadRequestError'); // 400

const SALT_ROUNDS = 10;
const { NODE_ENV, JWT_SECRET } = process.env;

// создаёт пользователя с переданными в теле email, password и name // POST /signup
const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hashedPassword) => {
      User.create({
        name,
        email,
        password: hashedPassword,
      })
        .then((user) => {
          res.status(201).send({
            _id: user._id,
            name: user.name,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже существует'));
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

/** GET-запрос. Получить пользователя по адресу /me */
const getCurrentUserInform = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

// обновляет профиль
const updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;

  // обновим имя, о себе найденного по _id пользователя
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

// Проверяет переданные (полученные) в теле запроса почту и пароль и возвращает JWT // POST /signin
const login = (req, res, next) => {
  // Получаем из запроса почту и пароль
  const { email, password } = req.body;

  // Проверяем, есть ли пользователь с такой почтой
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser,
  getCurrentUserInform,
  updateUserProfile,
  login,
};
