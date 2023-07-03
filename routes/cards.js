const router = require('express').Router();
const {
  createCardValidation,
  deleteCardValidation,
  likeCardValidation,
  dislikeCardValidation,
} = require('../utils/requestValidation');

const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', deleteCardValidation, deleteCard);
router.post('/', createCardValidation, createCard);
router.put('/:cardId/likes', likeCardValidation, likeCard);
router.delete('/:cardId/likes', dislikeCardValidation, dislikeCard);

module.exports = router;
