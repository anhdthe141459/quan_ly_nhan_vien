const mongoose = require('mongoose');

const chamCongSchema = new mongoose.Schema({
  ma_nhan_su:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'nhan_vien'
  },
  ngay_cham_cong: {
    type: Date,
  },
  trang_thai: {
    type: String
  },
  so_gio_lam_viec: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Tạo model từ schema
const ChamCongModel = mongoose.model('cham_cong', chamCongSchema);

module.exports = ChamCongModel;