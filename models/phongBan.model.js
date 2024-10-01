const mongoose = require('mongoose');

const phongBanSchema = new mongoose.Schema({
  ten_phong_ban: {
    type: String,
    required: true,
  },
  so_luong_nhan_vien: {
    type: Number,
  },
  ngay_thanh_lap: {
    type: Date,
  },
  ma_truong_phong: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'nhan_vien'
  },
  createdAt: {
    type: Date,
    default: Date.now   
  } 
});

// Tạo model từ schema
const PhongBanModel = mongoose.model('phong_ban', phongBanSchema);

module.exports = PhongBanModel;