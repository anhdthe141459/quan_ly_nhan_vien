const express = require('express');
const router = express.Router();
const phongBanController = require('../controllers/phongBan.controller');
const verifyTokenController = require('../controllers/verifyToken');


router.get('/getAllPhongBan',verifyTokenController.verifyToken, phongBanController.getPhongBans);
router.get('/countPhongBan',verifyTokenController.verifyToken, phongBanController.countPhongBan);
router.get('/getAllTenPhongBan',verifyTokenController.verifyToken, phongBanController.getAllTenPhongBan);
router.post('/crateOrUpdate',verifyTokenController.verifyToken, phongBanController.createOrUpdatePhongBan);
router.get('/getAllNhanVienNotPhongBan/:maPhongBan',verifyTokenController.verifyToken, phongBanController.getAllNhanVienNotPhongBan);
router.get('/getAllNhanVienPhongBan/:maPhongBan',verifyTokenController.verifyToken, phongBanController.getAllNhanVienPhongBan);
router.get('/search',verifyTokenController.verifyToken, phongBanController.searchPhongBan);
router.delete('/delete/:id',verifyTokenController.verifyToken, phongBanController.removePhongBan);
router.post('/genaratePhongBanData',verifyTokenController.verifyToken, phongBanController.genaratePhongBanData);
router.delete('/deleteAllData',verifyTokenController.verifyToken, phongBanController.deleteAllDataPhongBan);

module.exports = router;