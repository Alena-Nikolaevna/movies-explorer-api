const userRouter = require('express').Router();
const { updateUserProfileValidation } = require('../middlewares/validations');

const { getCurrentUserInform, updateUserProfile } = require('../controllers/users');

userRouter.get('/me', getCurrentUserInform); // GET /users/me — возвращает информацию о пользователе (email и имя)
userRouter.patch('/me', updateUserProfileValidation, updateUserProfile); // PATCH /users/me — обновляет информацию о пользователе (email и имя)

// userRouter.post('/', createUser); // POST /users — создаёт пользователя
// userRouter.get('/', getUsers); // GET /users — возвращает всех пользователей

// userRouter.get('/:userId', userIdValidation, getUser); // GET /users/:userId -
// возвращает пользователя по _id

// userRouter.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatar);
// PATCH /users/me/avatar — обновляет аватар

module.exports = userRouter;

//
// # возвращает информацию о пользователе (email и имя)
// GET /users/me

// # обновляет информацию о пользователе (email и имя)
// PATCH /users/me
