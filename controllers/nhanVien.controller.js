const nhanVienService = require('../services/nhanVien.service');

  const getNhanViens = async (req, res) => {
    try {
      const nhanViens = await nhanVienService.getNhanViens();
      res.json(nhanViens);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  const createOrUpdateNhanVien = async (req, res) => {
    try {
      const {nhanVien,chucVuCoQuan,nhanVienCccd}=req.body;
      await nhanVienService.createOrUpdateNhanVien(nhanVien,chucVuCoQuan,nhanVienCccd);
      res.json('oke');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  const choNhanVienNghiViec = async (req, res) => {
    try {
      const {id}=req.params;
      await nhanVienService.choNhanVienNghiViec(id);
      res.json("delete successfull");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  const searchNhanVien = async (req, res) => {
    try {
      const { query } = req;
      const searchQuery = {};
      if (query.ten_nhan_su !== 'undefined') {
        searchQuery.ten_nhan_su = { $regex: query.ten_nhan_su, $options: 'i' };
      }
  
      if (query.so_dien_thoai !== 'undefined') {
        searchQuery.so_dien_thoai = { $regex: query.so_dien_thoai, $options: 'i' };
      }

      if (query.gioi_tinh !== 'undefined') {
        searchQuery.gioi_tinh = { $regex: query.gioi_tinh, $options: 'i' };
      }

      if (query.noi_sinh !== 'undefined') {
        searchQuery.noi_sinh = { $regex: query.noi_sinh, $options: 'i' };
      }

      if (query.nguyen_quan !== 'undefined') {
        searchQuery.nguyen_quan = { $regex: query.nguyen_quan, $options: 'i' };
      }

      if (query.dia_chi_hien_tai !== 'undefined') {
        searchQuery.dia_chi_hien_tai = { $regex: query.dia_chi_hien_tai, $options: 'i' };
      }
      const nhanViens= await nhanVienService.searchNhanVien(searchQuery);
      res.json(nhanViens);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  const getAllTenNhanVienChuaCoBangLuong = async (req, res) => {
    try {
      const nhanViens = await nhanVienService.getAllTenNhanVienChuaCoBangLuong();
      res.json(nhanViens);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
    getNhanViens,
    createOrUpdateNhanVien,
    choNhanVienNghiViec,
    searchNhanVien,
    getAllTenNhanVienChuaCoBangLuong
};