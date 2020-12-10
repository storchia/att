const express = require('express');

const router = express.Router({ mergeParams: true });
const {
  getCategorias,
  getCategoria,
  addCategoria,
  updateCategoria,
  deleteCategoria,
  removeSocio,
} = require('../controllers/categoria');

const Categoria = require('../models/Categoria');

//const { protect, authorize } = require("../middleware/auth");
const advancedResults = require('../middleware/advancedResults');

router
  .route('/')
  .get(
    advancedResults(Categoria, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCategorias
  )
  .post(addCategoria);
// .post(protect, authorize("publisher", "admin"), addCategoria);

router.route('/:id').get(getCategoria).delete(deleteCategoria);
// .put(protect, authorize("publisher", "admin"), updateCategoria)
// .delete(protect, authorize("publisher", "admin"), deleteCategoria);

router.route('/:id/update').put(updateCategoria);

router.route('/:id/remove').put(removeSocio);

module.exports = router;
