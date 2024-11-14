const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const chamCongSchema = new mongoose.Schema({
  nhan_vien_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'nhan_vien'
  },
  ngay_cham_cong: {
    type: Date,
  },
  trang_thai: {
    type: String
  },
  gio_vao: {
    type: Date,
  },
  gio_ra: {
    type: Date,
  },
  so_gio_lam_them: {
    type: Number,
  },
  so_gio_lam_viec: {
    type: Number,
  },
  mo_ta: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

chamCongSchema.index({ ngay_cham_cong: 1 });

// Tạo model từ schema
const ChamCongModel = mongoose.model('cham_cong', chamCongSchema);

module.exports = ChamCongModel;