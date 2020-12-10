const express = require('express');
const {
  addSocioAttendance,
  removeSocioAttendance,
} = require('../controllers/attendance');

const router = express.Router();

router.route('/:id').put(addSocioAttendance);

router.route('/remove/:id').put(removeSocioAttendance);

module.exports = router;
