const mongoose = require('mongoose');

const nhanVienCCCDSchema = new mongoose.Schema({
  nhan_vien_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'nhan_vien'
  },
  so_cccd: {
    type: String,
    required: true,
  },
  ngay_cap_cccd: {
    type: Date,
  },
  noi_cap_cccd: {
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