const express = require('express');
const router = express.Router();
const chamCongController = require('../controllers/chamCong.controller');

router.get('/getChamCongMoiNgay/:maPhongBan', chamCongController.getChamCongMoiNgay);
router.post('/create', chamCongController.createChamCongs);


module.exports = router;