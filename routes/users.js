const router = require('express').Router();

const {
  getUserByIdValidation,
  updateUserDataByIdValidation,
  updateUserAvatarByIdValidation,
} = require('../utils/requestValidation');

const {
  getUsers,
  getUserById,
  getCurrentUserById,
  updateUserDataById,
  updateUserAvatarById,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUserById);
router.get('/:userId', getUserByIdValidation, getUserById);
router.patch('/me', updateUserDataByIdValidation, updateUserDataById);
router.patch('/me/avatar', updateUserAvatarByIdValidation, updateUserAvatarById);

module.exports = router;
