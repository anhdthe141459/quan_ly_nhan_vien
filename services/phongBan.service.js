const NhanVienModel = require('../models/nhanVien.model');
const ChucVuCoQuanModel = require('../models/chucVuCoQuan.model');
const NhanVienCCCDModel = require('../models/nhanVienCCCD.model');
const PhongBanModel =require('../models/phongBan.model')

const getPhongBans = async() =>{

    const phongBans = await PhongBanModel.find();
    
    const result = await Promise.all(phongBans.map(async (phongBan) => {
      const nhanVien = await NhanVienModel.findById(phongBan.ma_truong_phong).select('ten_nhan_su');
      const nhanVienChucVu = await ChucVuCoQuanModel.findOne({ nhan_vien_id: nhanVien?._id }).select('ma_nhan_su');
      const soLuongNhanVien = await ChucVuCoQuanModel.countDocuments({ma_phong_ban:phongBan?._id});
      return {
        ...phongBan._doc,
        so_luong_nhan_vien:soLuongNhanVien,
        ten_truong_phong:nhanVien?.ten_nhan_su,
        ma_truong_phong:nhanVienChucVu?.ma_nhan_su,
        ma_truong_phong_id:nhanVien?._id
      };
    }));
    
    // const data = result.map(nhanVien => {

    //     return nhanSu
    // });

    return result;
}
const getAllTenPhongBan = async(phongBan) =>{
  return await PhongBanModel.find().select('ten_phong_ban');
}

const createOrUpdatePhongBan = async(phongBan) =>{
    if(!phongBan.hasOwnProperty('_id')){
        const phongBanMoi=new PhongBanModel(phongBan);
        await phongBanMoi.save()
    }else{
        let phongBanUpdate=await PhongBanModel.findById(phongBan?._id);
        if(!phongBan.hasOwnProperty('ma_truong_phong')){
            phongBan.ma_truong_phong=null;
        }
        if(phongBan.ma_truong_phong==null){
          nhanVienChucVu = await ChucVuCoQuanModel.findOne({ nhan_vien_id: phongBanUpdate?.ma_truong_phong });
          console.log("nhanVienChucVu1111=========",nhanVienChucVu)
          if(nhanVienChucVu){
            nhanVienChucVu.ma_phong_ban=null;
            nhanVienChucVu.save();
          }
        }else{
          nhanVienChucVu = await ChucVuCoQuanModel.findOne({ nhan_vien_id: phongBan?.ma_truong_phong });
          console.log("nhanVienChucVu3333=========",nhanVienChucVu)
          nhanVienChucVu.ma_phong_ban=phongBan?._id;
          nhanVienChucVu.save();
        }
        
        Object.assign(phongBanUpdate, phongBan);
        await phongBanUpdate.save();
    }
    
}
const removePhongBan = async(id) =>{
    await PhongBanModel.findByIdAndDelete(id);
}

const searchNhanVien = async(query) =>{
    const nhanViens= await NhanVienModel.find(query);
    return nhanViens;
}

const getAllNhanVienNotPhongBan = async (maPhongBan) =>{
    const chucVuCoQuans = await ChucVuCoQuanModel.find().select('nhan_vien_id ma_phong_ban ma_nhan_su');
    const nhanVienNotPhongBans = chucVuCoQuans 
    .filter(item => item.ma_phong_ban== null || item.ma_phong_ban==maPhongBan); 
    const result = await Promise.all(nhanVienNotPhongBans?.map(async (nhanVien) => {
      const nhanViens = await NhanVienModel.findById(nhanVien?.nhan_vien_id).select('ten_nhan_su');
      return {
        ...nhanVien?._doc,
        ten_nhan_su:nhanViens?.ten_nhan_su,
        
      };
    }));
    return result;
}


module.exports = {
    getPhongBans,
    createOrUpdatePhongBan,
    removePhongBan,
    searchNhanVien,
    getAllNhanVienNotPhongBan,
    getAllTenPhongBan
};