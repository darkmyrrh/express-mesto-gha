const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserDataById,
  updateUserAvatarById,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUserDataById);
router.patch('/me/avatar', updateUserAvatarById);

module.exports = router;
