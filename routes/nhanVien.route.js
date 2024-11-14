const express = require('express');
const router = express.Router();
const nhanVienController = require('../controllers/nhanVien.controller');
const verifyTokenController = require('../controllers/verifyToken');

router.get('/getAllNhanVien',verifyTokenController.verifyToken, nhanVienController.getNhanViens);
router.get('/getAvatar/:id',verifyTokenController.verifyToken, nhanVienController.getAvatarNhanVien);
router.post('/crateOrUpdate',verifyTokenController.verifyToken, nhanVienController.createOrUpdateNhanVien);
router.delete('/delete/:id',verifyTokenController.verifyToken, nhanVienController.choNhanVienNghiViec);
router.get('/search',verifyTokenController.verifyToken, nhanVienController.searchNhanVien);
router.get('/getAllTenNhanVienChuaCoBangLuong',verifyTokenController.verifyToken, nhanVienController.getAllTenNhanVienChuaCoBangLuong);
router.get('/countNhanVien',verifyTokenController.verifyToken, nhanVienController.countNhanVien);
router.get('/downloadExcel',verifyTokenController.verifyToken, nhanVienController.downloadExcelNhanVien);
router.post('/crateChamCongs',verifyTokenController.verifyToken, nhanVienController.createOrUpdateNhanVien);

module.exports = router;