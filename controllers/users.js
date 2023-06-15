const mongoose = require('mongoose');

const User = require('../models/user');

const {
  SUCCESS,
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require('../utils/responceCodes');

module.exports.getUsers = (req, res) => User.find({})
  .then((users) => res.status(SUCCESS).send({ users }))
  .catch((err) => {
    console.log(err.message);
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
  });

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(SUCCESS).send({ user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Передан некорректный _id пользователя.' });
      }
      console.log(err.message);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((newUser) => res.status(CREATED).send({ newUser }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      console.log(err.message);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const updateUserById = (req, res, userData) => User.findByIdAndUpdate(
  req.user._id,
  userData,
  {
    new: true,
    runValidators: true,
  },
)
  .then((user) => {
    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
    }
    return res.status(SUCCESS).send({ user });
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
    }
    console.log(err.message);
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
  });

module.exports.updateUserDataById = (req, res) => {
  const { name, about } = req.body;
  return updateUserById(req, res, { name, about });
};

module.exports.updateUserAvatarById = (req, res) => {
  const { avatar } = req.body;
  return updateUserById(req, res, { avatar });
};
