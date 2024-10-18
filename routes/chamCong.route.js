const express = require('express');
const router = express.Router();
const chamCongController = require('../controllers/chamCong.controller');

router.get('/getChamCongMoiNgay/:maPhongBan', chamCongController.getChamCongMoiNgay);
router.get('/getChamCongMoiThang', chamCongController.getChamCongNhanVienTheoThang);
router.get('/getChamCongNhanVienChitTietTheoThang', chamCongController.getChamCongNhanVienChiTietTheoThang);
router.get('/getTrangThaiCuaNhanVienMoiThang', chamCongController.getTrangThaiCuaNhanVienMoiThang);
router.post('/create', chamCongController.createChamCongs);


module.exports = router;