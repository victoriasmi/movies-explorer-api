require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const { limiter } = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');
const NotFoundError = require('./errors/not-found-err');

const options = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://diploma.project.nomoredomains.club',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preFlightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

const app = express();
const { PORT = 3000 } = process.env;

app.use('*', cors(options));

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

app.use(requestLogger); // подключаем логгер запросов
// за ним идут все обработчики роутов

app.use('/', require('./routes/index'));

// авторизация
app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/movies'));

app.use((req, res, next) => {
  next(new NotFoundError('Страница по указанному маршруту не найдена'));
});

app.use(errorLogger); // подключаем логгер ошибок
// errorLogger нужно подключить после обработчиков роутов и до обработчиков ошибок

app.use(errors()); // обработчик ошибок celebrate
app.use(error);// централизованный обработчик ошибок

app.listen(PORT, () => {
  console.log(`app finally now listening to port ${PORT}`);
});
