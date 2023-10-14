const errorMiddlewares = (err, req, res, next) => {
  const { statusCode = 500 } = err;
  const message = statusCode === 500 ? 'На сервере произошла ошибка.' : err.message;
  res.status(statusCode).send({ message });
  next();
};

module.exports = errorMiddlewares;
