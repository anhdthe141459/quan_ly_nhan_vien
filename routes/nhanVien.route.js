const express = require('express');
const router = express.Router();
const nhanVienController = require('../controllers/nhanVien.controller');

router.get('/getAllNhanVien', nhanVienController.getNhanViens);
router.post('/crateOrUpdate', nhanVienController.createOrUpdateNhanVien);
router.delete('/delete/:id', nhanVienController.removeNhanVien);
router.get('/search', nhanVienController.searchNhanVien);

module.exports = router;