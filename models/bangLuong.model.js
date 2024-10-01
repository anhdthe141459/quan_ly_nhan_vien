const mongoose = require('mongoose');

const bangLuongSchema = new mongoose.Schema({
  ma_nhan_su:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'nhan_vien'
  },
  thang_luong: {
    type: Number,
  },
  nam_luong: {
    type: Number
  },
  tien_luong: {
    type: Number,
  },
  tien_luong_thuc_nhan: {
    type: Number,
  },
  ngay_tra_luong: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Tạo model từ schema
const BangLuongModel = mongoose.model('bang_luong', bangLuongSchema);

module.exports = BangLuongModel;