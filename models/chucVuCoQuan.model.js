const mongoose = require('mongoose');

const chucVuCoQuanSchema = new mongoose.Schema({
  ma_nhan_su:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'nhan_vien'
  },
  ma_phong_ban:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'phong_ban'
  },  
  chuc_vu: {
    type: String,
    required: true,
  },
  thoi_gian_cong_hien: {
    type: Number,
  },
  email:{
    type:String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Tạo model từ schema
const ChucVuCoQuanModel = mongoose.model('chuc_vu_co_quan', chucVuCoQuanSchema);

module.exports = ChucVuCoQuanModel;