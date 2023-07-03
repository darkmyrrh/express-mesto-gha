const mongoose = require('mongoose');

const Card = require('../models/card');
const { SUCCESS, CREATED } = require('../utils/responceCodes');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.status(SUCCESS).send({ cards }))
  .catch(next);

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .then((card) => {
      if (card) {
        if (card.owner.equals(req.user._id)) {
          return card.deleteOne().then(() => res.status(SUCCESS).send({ card }));
        }
        throw new ForbiddenError('Нельзя удалять чужие карточки.');
      }
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные при удалении карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
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
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

const updateCardData = (req, res, next, action) => Card.findByIdAndUpdate(
  req.params.cardId,
  action,
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    }
    return res.status(SUCCESS).send(card);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
    } else {
      next(err);
    }
  });

module.exports.likeCard = (req, res, next) => {
  updateCardData(req, res, next, { $addToSet: { likes: req.user._id } });
};

module.exports.dislikeCard = (req, res, next) => {
  updateCardData(req, res, next, { $pull: { likes: req.user._id } });
};
