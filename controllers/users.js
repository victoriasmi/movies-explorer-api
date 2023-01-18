const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
require('dotenv').config();
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => {
      res.status(200).send({
        name, email,
      });
    })
    // })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует.'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные.'));
      } else {
        next(err);
      }
    });
};

// Мы рекомендуем записывать JWT в httpOnly куку
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Ошибка аутентификации.'));
      }
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev_secret',
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
      return res.end();
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      next(new NotFoundError('Пользователь по указанному _id не найден.'));
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные.'));
      } else {
        next(err);
      }
    });
};

// return res.cookie('jwt', token, {
//   // token - наш JWT токен, который мы отправляем
//   maxAge: 3600000 * 24 * 7,
//   httpOnly: true,
//   sameSite: false,
//   secure: true,
// })
