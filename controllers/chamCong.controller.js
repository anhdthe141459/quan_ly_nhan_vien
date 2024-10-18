const chamCongService = require('../services/chamCong.service');

const createChamCongs = async (req, res) => {
    try {
      const {chamCongs}=req.body;
      await chamCongService.updateManyChamCong(chamCongs);
      res.json('success');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const getChamCongMoiNgay = async (req, res) => {
  try {
    const {maPhongBan}=req.params;
    const chamCongMoiNgays = await chamCongService.getChamCongMoiNgay(maPhongBan);
    res.json(chamCongMoiNgays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getChamCongNhanVienTheoThang = async (req, res) => {
  try {
    const { year, month } = req.query;
    const chamCongs= await chamCongService.getChamCongNhanVienTheoThang(year,month);
    res.json(chamCongs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getTrangThaiCuaNhanVienMoiThang = async (req, res) => {
  try {
    const { year, month, id } = req.query;
    const chamCongs= await chamCongService.getTrangThaiCuaNhanVienMoiThang(year,month,id);
    res.json(chamCongs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChamCongNhanVienChiTietTheoThang = async (req, res) => {
  try {
    const { year, month, id } = req.query;
    const chamCongs= await chamCongService.getChamCongNhanVienChiTietTheoThang(year,month,id);
    res.json(chamCongs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    createChamCongs,
    getChamCongMoiNgay,
    getChamCongNhanVienTheoThang,
    getChamCongNhanVienChiTietTheoThang,
    getTrangThaiCuaNhanVienMoiThang
};