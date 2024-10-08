const express = require('express');
const router = express.Router();
const nhanVienRoutes = require('./nhanVien.route');
const phongBanRoutes = require('./phongBan.route');

// Nhóm các route trong cùng một module
router.use('/nhanVien', nhanVienRoutes);
router.use('/phongBan', phongBanRoutes);

module.exports = router;