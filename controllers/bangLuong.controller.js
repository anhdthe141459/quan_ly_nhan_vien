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

const getLuongNhanVienTheoThang = async (req, res) => {
  try {
    const { year, month } = req.query;
    const bangLuongs= await bangLuongService.getLuongNhanVienTheoThang(year,month);
    res.json(bangLuongs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchBangLuong = async (req, res) => {
  try {
    const { query } = req;

    const searchQuery = {};
    searchQuery['chucVuNhanVienDetail.da_nghi_viec'] = false;
    if (query.ma_nhan_su !== 'undefined') {
      searchQuery['chucVuNhanVienDetail.ma_nhan_su'] = { $regex: query.ma_nhan_su, $options: 'i' };
    }

    if (query.ten_nhan_su !== 'undefined') {
      searchQuery['nhanVienDetail.ten_nhan_su'] = { $regex: query.ten_nhan_su, $options: 'i' };
    }

    const bangLuongs= await bangLuongService.searchBangLuong(searchQuery);
    res.json(bangLuongs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
    createOrUpdateBangLuong,
    getBangLuongChoNhanViens,
    getLuongNhanVienTheoThang,
    searchBangLuong
};