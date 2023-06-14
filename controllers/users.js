const User = require('../models/user');

module.exports.getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send({ users }))
  .catch(() => res.status(500).send({ message: 'С сервером что-то не так' }));

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(200).send({ user });
    })
    .catch(() => res.status(500).send({ message: 'С сервером что-то не так' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((newUser) => res.status(201).send({ newUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(500).send({ message: 'С сервером что-то не так' });
    });
};

module.exports.updateUserById = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user,
    { name, about },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(201).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(500).send({ message: 'С сервером что-то не так' });
    });
};

module.exports.updateUserAvatarById = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user,
    { avatar },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(201).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res.status(500).send({ message: 'С сервером что-то не так' });
    });
};
