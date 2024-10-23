const express = require('express');
const router = express.Router();
const bangLuongController = require('../controllers/bangLuong.controller');
const verifyTokenController = require('../controllers/verifyToken');

router.get('/getAllBangLuongChoNhanVien',verifyTokenController.verifyToken, bangLuongController.getBangLuongChoNhanViens);
router.get('/getLuongNhanVienTheoThang',verifyTokenController.verifyToken, bangLuongController.getLuongNhanVienTheoThang);
router.get('/search',verifyTokenController.verifyToken, bangLuongController.searchBangLuong);
router.get('/downloadExcel',verifyTokenController.verifyToken, bangLuongController.downloadExcelBangLuong);
router.post('/downloadExcelLuongTheoThang',verifyTokenController.verifyToken, bangLuongController.downloadExcelThongKeLuongTheoThang);
router.post('/createOrUpdate',verifyTokenController.verifyToken, bangLuongController.createOrUpdateBangLuong);


module.exports = router;