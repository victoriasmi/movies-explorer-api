const router = require('express').Router();
const { postmovieValidation, deletemovieValidation } = require('../middlewares/validation');

const {
  getMovie, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovie);
router.post(
  '/movies',
  postmovieValidation,
  createMovie,
);
router.delete(
  '/movies/:movieId',
  deletemovieValidation,
  deleteMovie,
);

module.exports = router;
