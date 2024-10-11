const express = require('express');
const router = express.Router();
const nhanVienRoutes = require('./nhanVien.route');
const phongBanRoutes = require('./phongBan.route');
const chamCongRoutes = require('./chamCong.route');
const bangLuongRoutes = require('./bangLuong.route');

// Nhóm các route trong cùng một module
router.use('/nhanVien', nhanVienRoutes);
router.use('/phongBan', phongBanRoutes);
router.use('/chamCong', chamCongRoutes);
router.use('/bangLuong', bangLuongRoutes);

module.exports = router;