const express = require('express');
const router = express.Router();
const chamCongController = require('../controllers/chamCong.controller');
const verifyTokenController = require('../controllers/verifyToken');

router.get('/getChamCongMoiNgay/:maPhongBan',verifyTokenController.verifyToken, chamCongController.getChamCongMoiNgay);
router.get('/getChamCongMoiThang',verifyTokenController.verifyToken, chamCongController.getChamCongNhanVienTheoThang);
router.get('/getChamCongNhanVienChitTietTheoThang',verifyTokenController.verifyToken, chamCongController.getChamCongNhanVienChiTietTheoThang);
router.get('/getTrangThaiCuaNhanVienMoiThang',verifyTokenController.verifyToken, chamCongController.getTrangThaiCuaNhanVienMoiThang);
router.get('/downloadExcelChamCongTheoThang',verifyTokenController.verifyToken, chamCongController.downloadExcelThongKeChamCongTheoThang);
router.post('/create',verifyTokenController.verifyToken, chamCongController.createChamCongs);


module.exports = router;