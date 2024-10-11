const nhanVienService = require('../services/nhanVien.service');
const phongBanservice =require('../services/phongBan.service');

  const getPhongBans = async (req, res) => {
    try {
      const phongBans = await phongBanservice.getPhongBans();
      res.json(phongBans);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  const createOrUpdatePhongBan = async (req, res) => {
    try {
      const {phongBan}=req.body;
      await phongBanservice.createOrUpdatePhongBan(phongBan);
      res.json('success');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  const removePhongBan = async (req, res) => {
    try {
      const {id}=req.params;
      await phongBanservice.removePhongBan(id);
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
  const getAllNhanVienNotPhongBan = async (req, res) => {
    try {
      const {maPhongBan}=req.params;
      const nhanVienNotTruongPhong = await phongBanservice.getAllNhanVienNotPhongBan(maPhongBan);
      res.json(nhanVienNotTruongPhong);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const getAllTenPhongBan = async (req, res) => {
    try {
      const tenPhongBans = await phongBanservice.getAllTenPhongBan();
      res.json(tenPhongBans);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  const getAllNhanVienPhongBan = async (req, res) => {
    try {
      const {maPhongBan}=req.params;
      const nhanVienPhongBans = await phongBanservice.getAllNhanVienPhongBan(maPhongBan);
      res.json(nhanVienPhongBans);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
    getPhongBans,
    createOrUpdatePhongBan,
    removePhongBan,
    searchNhanVien,
    getAllNhanVienNotPhongBan,
    getAllTenPhongBan,
    getAllNhanVienPhongBan
};