const mongoose = require('mongoose');

const bangLuongSchema = new mongoose.Schema({
  nhan_vien_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'nhan_vien'
  },
  tien_luong: {
    type: Number,
  },
  // tien_luong_thuc_nhan: {
  //   type: Number,
  // },
  khau_tru: {
    type: Number,
  },
  phu_cap: {
    type: Number,
  },
  ngay_tra_luong: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Tạo model từ schema
const BangLuongModel = mongoose.model('bang_luong', bangLuongSchema);

module.exports = BangLuongModel;