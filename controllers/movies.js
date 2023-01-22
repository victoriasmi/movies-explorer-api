const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const {
  badRequestError, notFoundError, forbiddenError,
} = require('../constants');

module.exports.getMovie = (req, res, next) => {
  Movie.find({}).sort({ createdAt: -1 })
    .then((movie) => {
      res.status(200).send({ data: movie });
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    // { new: true }
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(badRequestError));
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError(notFoundError);
    })
    .then((data) => {
      if (data.owner.valueOf() === req.user._id) {
        Movie.findByIdAndRemove(req.params.movieId, { new: true })
          .then((movie) => {
            res.status(200).send({ data: movie });
          });
      } else {
        next(new ForbiddenError(forbiddenError));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError(badRequestError));
      }
      next(err);
    });
};
