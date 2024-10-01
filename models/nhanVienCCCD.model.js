const mongoose = require('mongoose');

const nhanVienCCCDSchema = new mongoose.Schema({
  so_cccd: {
    type: String,
    required: true,
  },
  ngay_cap: {
    type: Date,
  },
  noi_cap: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Tạo model từ schema
const NhanVienCCCDModel = mongoose.model('nhan_vien_cccd', nhanVienCCCDSchema);

module.exports = NhanVienCCCDModel;