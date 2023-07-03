const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/utils');
const { SUCCESS, CREATED } = require('../utils/responceCodes');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const User = require('../models/user');

module.exports.getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(SUCCESS).send({ users }))
  .catch(next);

const findUserById = (req, res, next, userId) => User.findById(userId)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь с указанным _id не найден.');
    }
    return res.status(SUCCESS).send({ user });
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Передан некорректный _id пользователя.'));
    } else {
      next(err);
    }
  });

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  return findUserById(req, res, next, userId);
};

module.exports.getCurrentUserById = (req, res, next) => {
  const userId = req.user._id;
  return findUserById(req, res, next, userId);
};

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((newUser) => {
      res.status(CREATED).send({
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким адресом электронной почты уже зарегистрирован'));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ message: 'Вход успешно выполнен' });
    })
    .catch(next);
};

const updateUserById = (req, res, next, userData) => User.findByIdAndUpdate(
  req.user._id,
  userData,
  {
    new: true,
    runValidators: true,
  },
)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь с указанным _id не найден.');
    }
    return res.status(SUCCESS).send({ user });
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
    } else {
      next(err);
    }
  });

module.exports.updateUserDataById = (req, res, next) => {
  const { name, about } = req.body;
  return updateUserById(req, res, next, { name, about });
};

module.exports.updateUserAvatarById = (req, res, next) => {
  const { avatar } = req.body;
  return updateUserById(req, res, next, { avatar });
};
