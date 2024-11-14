const express = require('express');
const router = express.Router();
const nhanVienRoutes = require('./nhanVien.route');
const phongBanRoutes = require('./phongBan.route');
const chamCongRoutes = require('./chamCong.route');
const bangLuongRoutes = require('./bangLuong.route');
const authRoutes = require('./auth.route');
const generateRoutes = require('./generateData.route');

// Nhóm các route trong cùng một module
router.use('/nhanVien', nhanVienRoutes);
router.use('/phongBan', phongBanRoutes);
router.use('/chamCong', chamCongRoutes);
router.use('/bangLuong', bangLuongRoutes);
router.use('/auth', authRoutes);
router.use('/generate', generateRoutes);

module.exports = router;