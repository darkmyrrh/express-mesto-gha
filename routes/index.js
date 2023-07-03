const router = require('express').Router();

const userRoutes = require('./users');
const cardsRoutes = require('./cards');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { loginValidaion, createUserValidation } = require('../utils/requestValidation');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', loginValidaion, login);
router.post('/signup', createUserValidation, createUser);
router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardsRoutes);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

module.exports = router;
