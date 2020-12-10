const Socio = require('../models/Socio');
//const Attendance = require('../models/attendanceModel');
//const APIFeatures = require('../utils/apiFeatures');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
//const Fuse = require('../node_modules/fuse.js/dist/fuse.basic.common.js');

exports.addSocioAttendance = asyncHandler(async (req, res, next) => {
  let player = await Socio.findById(req.params.id);

  if (!player) {
    return next(new ErrorResponse('No player found with that ID', 404));
  }

  const result = player.presentismo.find(
    (item) =>
      item.date.toDateString() === new Date(req.body.date).toDateString()
  );

  console.log(result);

  if (result === undefined) {
    console.log('agregar');
    player = await Socio.findByIdAndUpdate(
      req.params.id,
      {
        $push: { presentismo: req.body },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  } else if (req.body.status !== result.status) {
    console.log('Borrar');

    player = await Socio.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { presentismo: { _id: result._id } },
      },
      {
        new: true,
      }
    );

    player = await Socio.findByIdAndUpdate(
      req.params.id,
      {
        $push: { presentismo: req.body },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      player,
    },
  });
});

exports.removeSocioAttendance = asyncHandler(async (req, res, next) => {
  let player = await Socio.findById(req.params.id);

  if (!player) {
    return next(new ErrorResponse('No player found with that ID', 404));
  }

  const result = player.presentismo.find(
    (item) =>
      item.date.toDateString() === new Date(req.body.date).toDateString()
  );

  if (!result) {
    return next(new ErrorResponse('No date found for player', 404));
  }
  console.log(result);
  player = await Socio.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { presentismo: { _id: result._id } },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      player,
    },
  });
});
