const asyncHandler = require('../middleware/async');
const Categoria = require('../models/Categoria');
const Socio = require('../models/Socio');

// @desc   Get Info from Categoria
// @route  GET /api/v1/info/:id
// @access Public
exports.getInfo = asyncHandler(async (req, res, next) => {
  const categoria = await Categoria.aggregate([
    {
      $match: { slug: 'superior-masculino-2020' },
    },
    {
      $lookup: {
        from: 'socios',
        localField: 'socio',
        foreignField: '_id',
        as: 'player',
      },
    },
    { $unwind: '$player' },
    { $group: { _id: '$player.presentismo.status', count: { $sum: 1 } } },
  ]);

  // Mostrar datos: Cantidad de presentes / ausentes / etc

  res.status(200).json({
    success: true,
    data: categoria,
  });

  // exports.getInfo = asyncHandler(async (req, res, next) => {
  //   const categoria = await Categoria.findById(req.params.id).populate({
  //     path: 'socio',
  //     select: 'nombre apellido presentismo',
  //   });
  //   res.status(200).json({
  //     success: true,
  //     data: categoria,
  //   });
});

// @desc   Get Info from particular day
// @route  GET /api/v1/info
// @access Public
exports.getInfoForDay = asyncHandler(async (req, res, next) => {
  const socio = await Socio.find(
    { 'presentismo.status': 'Presente' },
    'nombre apellido'
  ).populate('cat');

  res.status(200).json({
    success: true,
    data: socio,
    players: socio.length,
  });
});

// @desc   Get Info from Categoria
// @route  GET /api/v1/info/all
// @access Public

// Un llamado por cada busqueda
exports.getInfoAll = asyncHandler(async (req, res, next) => {
  const category = req.body.nombre;
  let { status } = req.body;

  if (status !== undefined) {
    status = { 'presentismo.status': req.body.status };
  }

  //const categoria = await Categoria.find(category).populate({
  const categoria = await Categoria.find({
    nombre: { $in: req.body.nombre },
  }).populate({
    path: 'socio',
    match: status,
    select: 'nombre apellido',
  });

  res.status(200).json({
    success: true,
    data: categoria,
    players: categoria.length,
  });
});

exports.getInfoAll2 = asyncHandler(async (req, res, next) => {
  const category = req.body.nombre;
  let { status } = req.body;

  if (status !== undefined) {
    status = { 'presentismo.status': req.body.status };
  }

  if (category === undefined) {
    const categoria = await Categoria.find().populate({
      path: 'socio',
      match: status,
      select: 'nombre apellido',
    });

    res.status(200).json({
      success: true,
      data: categoria,
      players: categoria.length,
    });
  }

  //const categoria = await Categoria.find(category).populate({
  const categoria = await Categoria.find({
    nombre: { $in: req.body.nombre },
  }).populate({
    path: 'socio',
    match: status,
    select: 'nombre apellido',
  });

  res.status(200).json({
    success: true,
    data: categoria,
    players: categoria.length,
  });
});

// Revisar si no es mejor hacer los calculos en el front.....

// Car
// .find()
// .populate({
//   path: 'socio',
//   model: 'Socio',
//   populate: {
//     path: 'presentismo',
//     model: 'Attendance',
//     match: { status: 'Presente' },
//     select: 'nombre apellido',
//   }
//
// })
