const express = require('express');
const router = express.Router();
const nhanVienController = require('../controllers/nhanVien.controller');

router.get('/getAllNhanVien', nhanVienController.getNhanViens);
router.post('/crateOrUpdate', nhanVienController.createOrUpdateNhanVien);
router.delete('/delete/:id', nhanVienController.choNhanVienNghiViec);
router.get('/search', nhanVienController.searchNhanVien);
router.get('/getAllTenNhanVienChuaCoBangLuong', nhanVienController.getAllTenNhanVienChuaCoBangLuong);
router.get('/countNhanVien', nhanVienController.countNhanVien);
router.post('/crateChamCongs', nhanVienController.createOrUpdateNhanVien);

module.exports = router;