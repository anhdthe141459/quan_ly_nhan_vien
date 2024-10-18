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
      searchQuery['da_nghi_viec']=false;
      if (query.ten_nhan_su !== 'undefined') {
        searchQuery['nhanVienDetail.ten_nhan_su'] = { $regex: query.ten_nhan_su, $options: 'i' };
      }
  
      if (query.so_dien_thoai !== 'undefined') {
        searchQuery['nhanVienDetail.so_dien_thoai'] = { $regex: query.so_dien_thoai, $options: 'i' };
      }

      if (query.gioi_tinh !== 'undefined') {
        searchQuery['nhanVienDetail.gioi_tinh'] = { $regex: query.gioi_tinh, $options: 'i' };
      }

      if (query.nguyen_quan !== 'undefined') {
        searchQuery['nhanVienDetail.nguyen_quan'] = { $regex: query.nguyen_quan, $options: 'i' };
      }

      if (query.dia_chi_hien_tai !== 'undefined') {
        searchQuery['nhanVienDetail.dia_chi_hien_tai'] = { $regex: query.dia_chi_hien_tai, $options: 'i' };
      }

      if (query.quoc_tich !== 'undefined') {
        searchQuery['nhanVienDetail.quoc_tich'] = { $regex: query.quoc_tich, $options: 'i' };
      }

      if (query.ma_nhan_su !== 'undefined') {
        searchQuery['ma_nhan_su'] = { $regex: query.ma_nhan_su, $options: 'i' };
      }

      if (query.thoi_gian_cong_hien !== 'undefined') {
        searchQuery['thoi_gian_cong_hien'] = { $regex: query.thoi_gian_cong_hien, $options: 'i' };
      }

      if (query.chuc_vu !== 'undefined') {
        searchQuery['chuc_vu'] = { $regex: query.chuc_vu, $options: 'i' };
      }

      if (query.so_cccd !== 'undefined') {
        searchQuery['nhanVienCCCDDetail.so_cccd'] = { $regex: query.so_cccd, $options: 'i' };
      }

      if (query.phong_ban_id !== 'undefined') {
        searchQuery['phongBanDetail._id'] = { $regex: query.phong_ban_id, $options: 'i' };
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
  const countNhanVien = async (req, res) => {
    try {
      const count = await nhanVienService.countNhanVien();
      res.json(count);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
    getNhanViens,
    createOrUpdateNhanVien,
    choNhanVienNghiViec,
    searchNhanVien,
    getAllTenNhanVienChuaCoBangLuong,
    countNhanVien
};