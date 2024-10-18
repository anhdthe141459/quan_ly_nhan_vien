const express = require('express');
const router = express.Router();
const phongBanController = require('../controllers/phongBan.controller');

router.get('/getAllPhongBan', phongBanController.getPhongBans);
router.get('/countPhongBan', phongBanController.countPhongBan);
router.get('/getAllTenPhongBan', phongBanController.getAllTenPhongBan);
router.post('/crateOrUpdate', phongBanController.createOrUpdatePhongBan);
router.get('/getAllNhanVienNotPhongBan/:maPhongBan', phongBanController.getAllNhanVienNotPhongBan);
router.get('/getAllNhanVienPhongBan/:maPhongBan', phongBanController.getAllNhanVienPhongBan);
router.get('/search', phongBanController.searchPhongBan);
router.delete('/delete/:id', phongBanController.removePhongBan);

module.exports = router;