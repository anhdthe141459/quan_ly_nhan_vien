const express = require('express');
const router = express.Router();
const bangLuongController = require('../controllers/bangLuong.controller');

router.get('/getAllBangLuongChoNhanVien', bangLuongController.getBangLuongChoNhanViens);
router.get('/getLuongNhanVienTheoThang', bangLuongController.getLuongNhanVienTheoThang);
router.get('/search', bangLuongController.searchBangLuong);
router.post('/createOrUpdate', bangLuongController.createOrUpdateBangLuong);


module.exports = router;