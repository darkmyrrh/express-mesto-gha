const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL_REGEX } = require('../utils/utils');

const {
  getUsers,
  getUserById,
  getCurrentUserById,
  updateUserDataById,
  updateUserAvatarById,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUserById);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).required(),
  }),
}), getUserById);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserDataById,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(URL_REGEX),
    }),
  }),
  updateUserAvatarById,
);

module.exports = router;
