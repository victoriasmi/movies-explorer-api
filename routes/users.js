const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getUsers, getUserById, updateAvatar, updateProfile, getCurrentUser,
} = require('../controllers/users');

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  } throw new Error('Некорректная ссылка.');
};

router.get('/users/me', getCurrentUser);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile,
);

module.exports = router;
