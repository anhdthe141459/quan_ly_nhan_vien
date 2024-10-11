const bangLuongService = require('../services/bangLuong.service');

const getBangLuongChoNhanViens = async (req, res) => {
    try {
      const bangLuongs = await bangLuongService.getBangLuongChoNhanViens();
      res.json(bangLuongs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
const createOrUpdateBangLuong = async (req, res) => {
    try {
      const {bangLuong}=req.body;
      await bangLuongService.createOrUpdateBangLuong(bangLuong);
      res.json('success');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrUpdateBangLuong,
    getBangLuongChoNhanViens
};