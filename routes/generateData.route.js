const express = require('express');
const router = express.Router();
const generateDataService = require('../services/generateData.service');
const verifyTokenController = require('../controllers/verifyToken');

router.post('/generatePhongBanData',verifyTokenController.verifyToken, generateDataService.generatePhongBanData);
router.delete('/deleteAllData',verifyTokenController.verifyToken, generateDataService.deleteAllDataPhongBan);
router.post('/generateNhanVienData',verifyTokenController.verifyToken, generateDataService.generateNhanVienData);
router.delete('/deleteAllDataNhanVien',verifyTokenController.verifyToken, generateDataService.deleteAllDataNhanVien);
router.post('/generateLuongNhanVienData',verifyTokenController.verifyToken, generateDataService.generateLuongNhanVienData);
router.delete('/deleteAllDataLuongNhanVien',verifyTokenController.verifyToken, generateDataService.deleteAllDataLuongNhanVien);
router.post('/generateChamCongNhanVienData',verifyTokenController.verifyToken, generateDataService.generateChamCongNhanVienData);
router.delete('/deleteAllDataChamCongNhanVien',verifyTokenController.verifyToken, generateDataService.deleteAllDataChamCongNhanVien);

module.exports = router;