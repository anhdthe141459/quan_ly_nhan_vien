const NhanVienModel = require('../models/nhanVien.model');
const ChucVuCoQuanModel = require('../models/chucVuCoQuan.model');
const NhanVienCCCDModel = require('../models/nhanVienCCCD.model');
const PhongBanModel =require('../models/phongBan.model');

const getPhongBans = async() =>{

    const phongBans = await PhongBanModel.find();
    
    const result = await Promise.all(phongBans.map(async (phongBan) => {
      const nhanVien = await NhanVienModel.findById(phongBan.ma_truong_phong).select('ten_nhan_su');
      const nhanVienChucVu = await ChucVuCoQuanModel.findOne({ nhan_vien_id: nhanVien?._id }).select('ma_nhan_su');
      const soLuongNhanVien = await ChucVuCoQuanModel.countDocuments({ma_phong_ban:phongBan?._id,da_nghi_viec:false});
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
          if(nhanVienChucVu){
            nhanVienChucVu.ma_phong_ban=null;
            nhanVienChucVu.save();
          }
        }else{
          nhanVienChucVu = await ChucVuCoQuanModel.findOne({ nhan_vien_id: phongBan?.ma_truong_phong });
          nhanVienChucVu.ma_phong_ban=phongBan?._id;
          nhanVienChucVu.save();
        }
        
        Object.assign(phongBanUpdate, phongBan);
        await phongBanUpdate.save();
    }
    
}
const removePhongBan = async(id) =>{
    await PhongBanModel.findByIdAndDelete(id);
    await ChucVuCoQuanModel.updateOne({ma_phong_ban:id},{ ma_phong_ban: null })
}

const searchNhanVien = async(query) =>{
    const nhanViens= await NhanVienModel.find(query);
    return nhanViens;
}

const getAllNhanVienNotPhongBan = async (maPhongBan) =>{
    const chucVuCoQuans = await ChucVuCoQuanModel.find({da_nghi_viec:false}).select('nhan_vien_id ma_phong_ban ma_nhan_su');
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

const getAllNhanVienPhongBan = async (maPhongBan) =>{
  if(maPhongBan=='all'){
    const chucVuCoQuans = await ChucVuCoQuanModel.find({da_nghi_viec : false}).populate('nhan_vien_id');
    const nhanViens=chucVuCoQuans.map( (chucVuCoQuan) =>{
      return {
        nhan_vien_id:chucVuCoQuan.nhan_vien_id._id,
        ma_nhan_su:chucVuCoQuan.ma_nhan_su,
        ten_nhan_su:chucVuCoQuan.nhan_vien_id.ten_nhan_su
      }
    });
    return nhanViens
  }else{
    const chucVuCoQuans = await ChucVuCoQuanModel.find({da_nghi_viec : false}).select('nhan_vien_id ma_phong_ban ma_nhan_su -_id');
    const nhanVienPhongBans= chucVuCoQuans 
    .filter(item => item.ma_phong_ban==maPhongBan);
    const result = await Promise.all(nhanVienPhongBans?.map(async (nhanVien) => {
      const nhanViens = await NhanVienModel.findById(nhanVien?.nhan_vien_id).select('ten_nhan_su');
      return {
        ...nhanVien?._doc,
        ten_nhan_su:nhanViens?.ten_nhan_su,
      };
    }));
    return result;
  }
}
const searchPhongBan = async(query) =>{
  return await PhongBanModel.find(query);
}

const countPhongBan = async() =>{
  return await PhongBanModel.countDocuments();
}


module.exports = {
    getPhongBans,
    createOrUpdatePhongBan,
    removePhongBan,
    searchNhanVien,
    getAllNhanVienNotPhongBan,
    getAllTenPhongBan,
    getAllNhanVienPhongBan,
    searchPhongBan,
    countPhongBan
};