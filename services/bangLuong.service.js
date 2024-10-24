const BangLuongModel = require("../models/bangLuong.model");
const ChucVuCoQuanModel = require("../models/chucVuCoQuan.model");
const NhanVienModel = require("../models/nhanVien.model");
const chamCongService = require('./chamCong.service');

const getBangLuongChoNhanViens = async() =>{

    const bangLuongs = await BangLuongModel.find();
    
    const result = await Promise.all(bangLuongs.map(async (bangLuong) => {
      const nhanVien = await NhanVienModel.findById(bangLuong.nhan_vien_id).select('ten_nhan_su');
      const nhanVienChucVu = await ChucVuCoQuanModel.findOne({ nhan_vien_id: bangLuong.nhan_vien_id ,da_nghi_viec:false}).select('ma_nhan_su');
      if(nhanVienChucVu){
        return {
            ten_nhan_su:nhanVien?.ten_nhan_su,
            ma_nhan_su:nhanVienChucVu?.ma_nhan_su,
            ...bangLuong._doc,
          };
      }else{
        return null;
      }
    }));

    const filteredResult = result.filter(item => item !== null);
    return filteredResult;
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

const getLuongNhanVienTheoThang = async(year, month) =>{
    // const bangLuongs = await BangLuongModel.find();

    const nhanVienChucVu = await ChucVuCoQuanModel.find({da_nghi_viec:false}).select('ma_nhan_su nhan_vien_id ma_phong_ban');
    
    const result = await Promise.all(nhanVienChucVu.map(async (nhanVien) => {
      const bangLuong = await BangLuongModel.findOne({nhan_vien_id:nhanVien.nhan_vien_id});
      if(bangLuong){
        const tenNhanVien = await NhanVienModel.findById(nhanVien.nhan_vien_id).select('ten_nhan_su');
        const tongSoGioLamViecNhanVien = await chamCongService.getTongGioLamViecCuaNhanVienMoiThang(year, month,nhanVien.nhan_vien_id);
        let tongSoLuongThucNhanNhanVien=0;
        let tongSoCongNhanVien=0;
        if(tongSoGioLamViecNhanVien[0]!=undefined){
            tongSoCongNhanVien = tongSoGioLamViecNhanVien[0]?.tongSoGioLamViecChinhThuc+tongSoGioLamViecNhanVien[0]?.tongSoGioLamThem;
            const soLuongTheoGioNhanVien = bangLuong.tien_luong/160;
            tongSoLuongThucNhanNhanVien = (soLuongTheoGioNhanVien.toFixed(2) * tongSoCongNhanVien) + bangLuong.phu_cap - bangLuong.khau_tru;
        }

        return {
          ...nhanVien._doc,
          ten_nhan_su:tenNhanVien.ten_nhan_su,
          tien_luong_co_ban:bangLuong.tien_luong,
          tongSoCongNhanVien:tongSoCongNhanVien,
          tien_luong_thuc_nhan:tongSoLuongThucNhanNhanVien,
          ngay_tra_luong:bangLuong.ngay_tra_luong
        };
      }else{
        return null
      }
    }));
    const filteredResult = result.filter(item => item !== null);
    return filteredResult;
}

const searchBangLuong = async(query) =>{
    const bangLuongs=await BangLuongModel.aggregate([
        {
          $lookup: {
            from: 'nhan_viens', 
            localField: 'nhan_vien_id',
            foreignField: '_id',
            as: 'nhanVienDetail',
          },
        },
        {
            $unwind:  { path: '$nhanVienDetail', preserveNullAndEmptyArrays: true },
        },   
        {
            $lookup: {
              from: 'chuc_vu_co_quans', 
              localField: 'nhan_vien_id',
              foreignField: 'nhan_vien_id',
              as: 'chucVuNhanVienDetail',
            },
          },
          {
              $unwind:  { path: '$chucVuNhanVienDetail', preserveNullAndEmptyArrays: true },
          },     
          {
            $lookup: {
              from: 'phong_bans', 
              localField: 'chucVuNhanVienDetail.ma_phong_ban',
              foreignField: '_id',
              as: 'phongBanDetail',
            },
          },
          {
              $unwind:  { path: '$phongBanDetail', preserveNullAndEmptyArrays: true },
          }, 
          {
            $addFields: {
              phongBanDetailIdString: { $toString: '$phongBanDetail._id' }
            }
        },
        {
            $match: query,
        }
      ]);

      const result = bangLuongs.map(bangLuong => {
        return {
            ...bangLuong._doc,
            ma_nhan_su:bangLuong.chucVuNhanVienDetail.ma_nhan_su,
            ten_nhan_su:bangLuong.nhanVienDetail.ten_nhan_su,
            tien_luong:bangLuong.tien_luong,
            phu_cap:bangLuong.phu_cap,
            khau_tru:bangLuong.khau_tru,
            ngay_tra_luong:bangLuong.ngay_tra_luong
          };

    });
    return result;
  }
  

module.exports = {
    createOrUpdateBangLuong,
    getBangLuongChoNhanViens,
    getLuongNhanVienTheoThang,
    searchBangLuong,
};