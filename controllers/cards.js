const mongoose = require('mongoose');

const Card = require('../models/card');
const {
  SUCCESS,
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require('../utils/responceCodes');

module.exports.getCards = (req, res) => Card.find({})
  .then((cards) => res.status(SUCCESS).send({ cards }))
  .catch((err) => {
    console.log(err.message);
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
  });

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(SUCCESS).send({ card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при удалении карточки.' });
      }
      console.log(err.message);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link, likes } = req.body;
  return Card.create({
    name,
    link,
    likes,
    owner,
  })
    .then((newCard) => res.status(CREATED).send({ data: newCard }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      console.log(err.message);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res.status(SUCCESS).send(card);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
    }
    console.log(err.message);
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res.status(SUCCESS).send(card);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для удаления лайка.' });
    }
    console.log(err.message);
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
  });
