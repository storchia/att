const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Categoria = require('../models/Categoria');
// const Socio = require('../models/Socio');

// @desc   Get all categorias
// @route  GET /api/v1/categorias
// @access Public
exports.getCategorias = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Get single categoria
// @route  GET /api/v1/categoria/:id
// @access Public
exports.getCategoria = asyncHandler(async (req, res, next) => {
  const categoria = await Categoria.findById(req.params.id).populate({
    path: 'socio',
    select: 'nombre apellido presentismo',
  });

  if (!categoria) {
    return next(new ErrorResponse(`Categoria no se encontro`, 404));
  }

  res.status(200).json({
    success: true,
    data: categoria,
    players: categoria.socio.length,
  });
});

// @desc   Add Categoria
// @route  POST /api/v1/categoria
// @access Private
exports.addCategoria = asyncHandler(async (req, res, next) => {
  // req.body.bootcamp = req.params.bootcampId;
  // req.body.user = req.user.id;
  //
  // const bootcamp = await Socio.findById(req.params.bootcampId);
  //
  // if (!bootcamp) {
  //   return next(
  //     new ErrorResponse(`Socio not found with id of ${req.params.id}`, 404)
  //   );
  // }
  //
  // // Make sure user is Socio owner
  // if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
  //       401
  //     )
  //   );
  // }

  const categoria = await Categoria.create(req.body);

  res.status(200).json({
    success: true,
    data: categoria,
  });
});

// @desc   Update Categoria / Agregar Socio
// @route  PUT /api/v1/categoria/:categoriaId/update
// @access Private
exports.updateCategoria = asyncHandler(async (req, res, next) => {
  let categoria = await Categoria.findById(req.params.id);
  const socio = await Categoria.find({ socio: req.body.socio });
  console.log(socio.length);
  if (!categoria) {
    return next(new ErrorResponse(`Categoria no se encontro`, 404));
  }

  if (socio.length > 0) {
    return next(new ErrorResponse(`Jugador ya ingresado a una Categoria`, 404));
  }
  // // Make sure user is categoria owner
  // if (categoria.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to edit a categoria ${categoria._id}`,
  //       401
  //     )
  //   );
  // }
  if (req.body.socio) {
    categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      { $push: { socio: req.body.socio } },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  }
  res.status(200).json({
    success: true,
    data: categoria,
  });
});

// @desc   Delete Categoria
// @route  DELETE /api/v1/categoria/:categoriaId
// @access Private
exports.deleteCategoria = asyncHandler(async (req, res, next) => {
  const categoria = await Categoria.findById(req.params.id);

  if (!categoria) {
    return next(new ErrorResponse(`Categoria no se encontro`, 404));
  }

  // // Make sure user is categoria owner
  // if (categoria.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to delete categoria ${categoria._id}`,
  //       401
  //     )
  //   );
  // }

  await categoria.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc   Remove Socio from Categoria
// @route  PUT /api/v1/categoria/:categoriaId/remove
// @access Private
exports.removeSocio = asyncHandler(async (req, res, next) => {
  let categoria = await Categoria.findById(req.params.id);
  const socioPosition = categoria.socio.indexOf(req.body.socio);
  const socio = categoria.socio[socioPosition];

  if (!categoria) {
    return next(new ErrorResponse(`Categoria no se encontro`, 404));
  }

  if (socio === undefined || socio.toString() !== req.body.socio) {
    return next(
      new ErrorResponse(`Jugador no registrado en esta categoria`, 404)
    );
  }

  // // Make sure user is categoria owner
  // if (categoria.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to delete categoria ${categoria._id}`,
  //       401
  //     )
  //   );
  // }
  categoria = await Categoria.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { socio: req.body.socio },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    data: {},
  });
});
