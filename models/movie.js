const mongoose = require('mongoose');
// const urlRegExp = require('urlregex');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    // minlength: 2, // минимальная длина имени — 2 символа
    // maxlength: 30, // а максимальная — 30 символов
  },
  director: {
    type: String,
    required: true,
    // minlength: 2, // минимальная длина имени — 2 символа
    // maxlength: 30, // а максимальная — 30 символов
  },
  duration: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: { //url
    type: String,
    required: true,
    // проверка на url тут????
  },
  trailerLink: { //url
    type: String,
    required: true,
    // проверка на url тут????
  },
  thumbnail: { //url
    type: String,
    required: true,
    // проверка на url тут????
  },
  owner: { // _id поле?
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: { // id поле?
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  //   likes: {
  //     type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  //     default: [],
  //   },
  //   createdAt: {
  //     type: Date, // имя — это строка
  //     default: Date.now,
  //   },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('movie', movieSchema);
