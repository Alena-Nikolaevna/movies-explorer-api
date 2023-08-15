const router = require('express').Router();

const userRouter = require('./users');
const movieRouter = require('./movies');

const authMiddleware = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError'); // 404 ошибка

const { login, createUser } = require('../controllers/users');
const { signinValidation, signupValidation } = require('../middlewares/validations');

router.post('/signin', signinValidation, login); // проверяет переданные в теле почту и пароль
router.post('/signup', signupValidation, createUser); // создаёт пользователя

// все роуты (кроме /signin и /signup) защищены авторизацией
router.use(authMiddleware);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
