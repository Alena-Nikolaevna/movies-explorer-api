const userRouter = require('express').Router();
const { updateUserProfileValidation } = require('../middlewares/validations');

const { getCurrentUserInform, updateUserProfile } = require('../controllers/users');

userRouter.get('/me', getCurrentUserInform); // GET /users/me — возвращает информацию о пользователе (email и имя)
userRouter.patch('/me', updateUserProfileValidation, updateUserProfile); // PATCH /users/me — обновляет информацию о пользователе (email и имя)

module.exports = userRouter;
