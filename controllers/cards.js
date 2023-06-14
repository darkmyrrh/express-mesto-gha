const Card = require('../models/card');

module.exports.getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send({ cards }))
  .catch((err) => res.status(500).send({ message: err.message }));

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при удалении карточки.' });
      }
      return res.status(500).send({ message: err.message });
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
    .then((newCard) => res.status(201).send({ data: newCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res.status(200).send(card);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
    }
    return res.status(500).send({ message: err.message });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res.status(200).send(card);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для удаления лайка.' });
    }
    return res.status(500).send({ message: err.message });
  });
