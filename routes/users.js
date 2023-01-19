const router = require('express').Router();
const { userValidation } = require('../middlewares/validation');

const {
  updateProfile, getCurrentUser,
} = require('../controllers/users');

router.get('/users/me', getCurrentUser);

router.patch(
  '/users/me',
  userValidation,
  updateProfile,
);

module.exports = router;
