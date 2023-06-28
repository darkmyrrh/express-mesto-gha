const router = require('express').Router();


const {
  getUsers,
  getUserById,
  updateUserDataById,
  updateUserAvatarById,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserById);
router.patch('/me', updateUserDataById);
router.patch('/me/avatar', updateUserAvatarById);

module.exports = router;
