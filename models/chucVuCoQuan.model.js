const mongoose = require('mongoose');

const chucVuCoQuanSchema = new mongoose.Schema({
  nhan_vien_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'nhan_vien'
  },
  ma_phong_ban:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'phong_ban'
  }, 
  ma_nhan_su: {
    type: String,
    required: true,
  }, 
  chuc_vu: {
    type: String,
    required: true,
  },
  thoi_gian_cong_hien: {
    type: Number,
  },
  // email:{
  //   type:String,
  // },
  da_nghi_viec: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

chucVuCoQuanSchema.index({ da_nghi_viec: 1, createdAt: 1 });
chucVuCoQuanSchema.index({ ma_phong_ban: 1 });

// Tạo model từ schema
const ChucVuCoQuanModel = mongoose.model('chuc_vu_co_quan', chucVuCoQuanSchema);

module.exports = ChucVuCoQuanModel;