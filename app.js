const express = require('express');

require('dotenv').config();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const { PORT = 3000, DEV_DB_HOST = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const cors = require('cors');

const helmet = require('helmet');
const limiter = require('./middlewares/rateLimit');

const app = express();

const allowedCors = [
  // 'https://mesto-ank.nomoreparties.co',
  // 'http://mesto-ank.nomoreparties.co',

  'https://api.movies-ank.nomoreparties.co',
  'http://api.movies-ank.nomoreparties.co',
  'http://localhost:3000',
];

const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  credentials: true,
};

const errorMiddlewares = require('./middlewares/error');

const router = require('./routes/index');

// импортируем логгеры
const { requestLogger, errorLogger } = require('./middlewares/logger');

// для защиты приложения от некоторых широко известных веб-уязвимостей
app.use(helmet());

// для ограничения кол-ва запросов, для защиты от DoS-атак
app.use(limiter);

app.use(cors(corsOptions));

// подключаемся к серверу mongo
mongoose.connect(DEV_DB_HOST);

app.use(bodyParser.json());

// Логгер запросов нужно подключить до всех обработчиков роутов
app.use(requestLogger); // подключаем логгер запросов

/* app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
}); */

app.use(router); // обработчик роутов

// логгер ошибок нужно подключить после обработчиков роутов и до обработчиков ошибок
app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate
app.use(errorMiddlewares); // централизованная обработка ошибок

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Сервер запущен');
});
