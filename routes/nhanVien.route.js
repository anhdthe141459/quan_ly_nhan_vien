const express = require('express');
const router = express.Router();
const nhanVienController = require('../controllers/nhanVien.controller');

router.get('/getAllNhanVien', nhanVienController.getNhanViens);

module.exports = router;