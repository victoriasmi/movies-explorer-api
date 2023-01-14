const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  } throw new Error('Некорректная ссылка.');
};

router.get('/movies', getMovie);
router.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(method),
    }),
  }),
  createMovie,
);
router.delete(
  '/movies/_id ',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex(),
    }),
  }),
  deleteMovie,
);


module.exports = router;
