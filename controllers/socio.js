const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Socio = require('../models/Socio');
//const path = require('path');

// @desc   Get all socios
// @route  GET /api/v1/socios
// @access Private
exports.getSocios = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Get single socio
// @route  GET /api/v1/socios/:id
// @access Public
exports.getSocio = asyncHandler(async (req, res, next) => {
  const socio = await Socio.findById(req.params.id).populate('cat');

  if (!socio) {
    return next(new ErrorResponse(`Socio no encontrado`, 404));
  }

  res.status(200).json({
    success: true,
    data: socio,
  });
});

// @desc   Add socio
// @route  POST /api/v1/socios
// @access Private
exports.createSocio = asyncHandler(async (req, res, next) => {
  // Add Socio to req.body
  //req.body.socio = req.socio.id;

  // if (req.user.role !== 'admin') {
  //   return next(new ErrorResponse(`No esta autorizado a agregar socios`, 400));
  // }

  const socio = await Socio.create(req.body);

  res.status(201).json({
    success: true,
    data: socio,
  });
});

// @desc   Update Socio
// @route  PUT /api/v1/socios/:id
// @access Private
exports.updateSocio = asyncHandler(async (req, res, next) => {
  let socio = await Socio.findById(req.params.id);

  if (!socio) {
    return next(new ErrorResponse(`Socio no encontrado`, 404));
  }

  // // Make sure user is Admin
  // if (socio.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(`No esta autorizado a realizar cambios`, 401)
  //   );
  // }

  socio = await Socio.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: socio,
  });
});

// @desc   Delete Socio
// @route  DELETE /api/v1/socios/:id
// @access Private
exports.deleteSocio = asyncHandler(async (req, res, next) => {
  const socio = await Socio.findById(req.params.id);

  if (!socio) {
    return next(new ErrorResponse(`Socio no encontrado`, 404));
  }

  // // Make sure user is Socio owner
  // if (socio.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(`No esta autorizado a realizar cambios`, 401)
  //   );
  // }

  socio.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// // @desc   Upload Photo
// // @route  PUT /api/v1/bootcamps/:id/photo
// // @access Private
// exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
//   const bootcamp = await Bootcamp.findById(req.params.id);
//
//   if (!bootcamp) {
//     return next(
//       new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
//     );
//   }
//
//   // Make sure user is Bootcamp owner
//   if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
//     return next(
//       new ErrorResponse(
//         `User ${req.params.id} is not authorized to delete this bootcamp`,
//         401
//       )
//     );
//   }
//
//   if (!req.files) {
//     return next(new ErrorResponse(`Please upload a file`, 400));
//   }
//
//   console.log(req.files);
//   const { file } = req.files;
//
//   //Make sure image is a Photo
//   if (!file.mimetype.startsWith('image')) {
//     return next(new ErrorResponse(`Please upload an image file`, 400));
//   }
//
//   // Check filesize
//   if (file.size > process.env.MAX_FILE_UPLOAD) {
//     return next(
//       new ErrorResponse(
//         `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
//         400
//       )
//     );
//   }
//
//   // Create custom file
//   file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
//
//   file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
//     if (err) {
//       console.log(err);
//       return next(new ErrorResponse(`Problem with file upload`, 500));
//     }
//
//     await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
//
//     res.status(200).json({
//       success: true,
//       data: file.name,
//     });
//   });
//
//   console.log(file.name);
// });
