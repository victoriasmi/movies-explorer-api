const router = require('express').Router();
const { signupValidation, signinValidation } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');

router.post(
  '/signup',
  signupValidation,
  createUser,
);

router.post(
  '/signin',
  signinValidation,
  login,
);

module.exports = router;
