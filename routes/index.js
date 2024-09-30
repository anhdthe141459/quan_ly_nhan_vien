const express = require('express');
const router = express.Router();
const nhanVienRoutes = require('./nhanVien.route');

// Nhóm các route trong cùng một module
router.use('/nhanVien', nhanVienRoutes);

module.exports = router;