const router = require('express').Router();

const userRoutes = require('./users');
const cardsRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardsRoutes);

module.exports = router;
