const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401

const { NODE_ENV, JWT_SECRET } = process.env;

// middleware авторизации для проверки JWT
module.exports = (req, res, next) => {
  // Достаём авторизационный заголовок
  const { authorization } = req.headers;

  // Убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  // Если токен на месте, извлечём его.
  // Для этого вызовем метод replace, чтобы выкинуть из заголовка приставку 'Bearer '
  // Таким образом, в переменную token запишется только JWT
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // Верифицируем токен -
    // проверяем, что пользователь прислал именно тот токен, который был выдан ему ранее
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // Отправим ошибку, если не получилось верифицировать
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  req.user = payload; // добавляет в объект запроса payload токена
  next(); // пропускает запрос дальше
};
