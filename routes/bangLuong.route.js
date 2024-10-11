const express = require('express');
const router = express.Router();
const bangLuongController = require('../controllers/bangLuong.controller');

router.get('/getAllBangLuongChoNhanVien', bangLuongController.getBangLuongChoNhanViens);
router.post('/createOrUpdate', bangLuongController.createOrUpdateBangLuong);


module.exports = router;