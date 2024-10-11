const BangLuongModel = require("../models/bangLuong.model");
const ChucVuCoQuanModel = require("../models/chucVuCoQuan.model");
const NhanVienModel = require("../models/nhanVien.model");


const getBangLuongChoNhanViens = async() =>{

    const bangLuongs = await BangLuongModel.find();
    
    const result = await Promise.all(bangLuongs.map(async (bangLuong) => {
      const nhanVien = await NhanVienModel.findById(bangLuong.nhan_vien_id).select('ten_nhan_su');
      const nhanVienChucVu = await ChucVuCoQuanModel.findOne({ nhan_vien_id: bangLuong.nhan_vien_id }).select('ma_nhan_su');
      return {
        ...bangLuong._doc,
        ten_nhan_su:nhanVien?.ten_nhan_su,
        ma_nhan_su:nhanVienChucVu?.ma_nhan_su,
      };
    }));

    return result;
}
const createOrUpdateBangLuong = async(bangLuong) =>{
    if(!bangLuong.hasOwnProperty('_id')){
        const bangLuongMoi = new BangLuongModel(bangLuong);
        await bangLuongMoi.save();
    }else{
        let bangLuongUpdate =await BangLuongModel.findById(bangLuong._id);
        Object.assign(bangLuongUpdate, bangLuong);
        await bangLuongUpdate.save();
    }
    

}

module.exports = {
    createOrUpdateBangLuong,
    getBangLuongChoNhanViens
};