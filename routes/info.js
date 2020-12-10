const express = require('express');
const { getInfo, getInfoForDay, getInfoAll } = require('../controllers/info');

const router = express.Router();

router.route('/').get(getInfoForDay);
router.route('/all').get(getInfoAll);
router.route('/:id').get(getInfo);

module.exports = router;
