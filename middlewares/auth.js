const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const { JWT_SECRET = 'dev_secret' } = process.env;
const {
  unauthorizedError,
} = require('../constants');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError(unauthorizedError));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(
      token,
      JWT_SECRET,
    );
  } catch (err) {
    next(new UnauthorizedError(unauthorizedError));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};

// const { JWT_SECRET = 'dev_secret' } = process.env;
// !authorization.startsWith('Bearer ')
// const token = req.cookies.jwt;
// if (!jwtCookies) {
//   throw new ForbiddenError({ message: 'Такого пользователя не существует.' });
// }
