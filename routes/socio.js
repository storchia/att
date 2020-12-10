const express = require('express');

const router = express.Router();

const {
  getSocios,
  getSocio,
  createSocio,
  updateSocio,
  deleteSocio,
} = require('../controllers/socio');

const Socio = require('../models/Socio');

//const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

// Use other routers
// const courseRouter = require("./courses");
// const reviewRouter = require("./reviews");

// router.use("/:bootcampId/courses", courseRouter);
// router.use("/:bootcampId/reviews", reviewRouter);

router
  .route('/')
  .get(advancedResults(Socio, 'courses'), getSocios)
  .post(createSocio);
// .post(protect, authorize('publisher', 'admin'), createSocio);
router.route('/:id').get(getSocio).put(updateSocio).delete(deleteSocio);
// .put(protect, authorize('publisher', 'admin'), updateSocio)
// .delete(protect, authorize('publisher', 'admin'), deleteSocio);

// router
//   .route("/:id/photo")
//   .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

module.exports = router;
