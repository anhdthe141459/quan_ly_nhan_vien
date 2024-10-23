const NhanVienModel = require('../models/nhanVien.model');
const ChucVuCoQuanModel = require('../models/chucVuCoQuan.model');
const NhanVienCCCDModel = require('../models/nhanVienCCCD.model');
const PhongBanModel = require('../models/phongBan.model');
const BangLuongModel = require('../models/bangLuong.model');
const { getAllNhanVienNotPhongBan } = require('./phongBan.service');

const getNhanViens = async() =>{

    
    const nhanVienChucVus = await ChucVuCoQuanModel.find({da_nghi_viec:false });
      const result = await Promise.all(nhanVienChucVus.map(async (nhanVien) => {
      const nhanVienDetail = await NhanVienModel.findById(nhanVien.nhan_vien_id);
      const nhanVienCCCDDetail = await NhanVienCCCDModel.findOne({ nhan_vien_id: nhanVien.nhan_vien_id });
      const phongBanDetail = await PhongBanModel.findById(nhanVien?.ma_phong_ban).select('ten_phong_ban');

      return {
        ...nhanVien._doc,
        nhanVienDetail,      
        nhanVienCCCDDetail,
        phongBanDetail      
      };
    }));

    const data = result.map(nhanVien => {
        const nhanSu={
            _id:nhanVien.nhan_vien_id,
            ma_nhan_su: nhanVien.ma_nhan_su, 
            ten_nhan_su:nhanVien.nhanVienDetail.ten_nhan_su,
            gioi_tinh:nhanVien.nhanVienDetail.gioi_tinh,
            nam_sinh:nhanVien.nhanVienDetail.nam_sinh,
            noi_sinh:nhanVien.nhanVienDetail.noi_sinh,
            nguyen_quan:nhanVien.nhanVienDetail.nguyen_quan,
            dia_chi_hien_tai:nhanVien.nhanVienDetail.dia_chi_hien_tai,
            so_dien_thoai:nhanVien.nhanVienDetail.so_dien_thoai,
            dan_toc:nhanVien.nhanVienDetail.dan_toc,
            ton_giao:nhanVien.nhanVienDetail.ton_giao,
            trinh_do_van_hoa:nhanVien.nhanVienDetail.trinh_do_van_hoa,
            quoc_tich:nhanVien.nhanVienDetail.quoc_tich,
            tinh_trang_hon_nhan:nhanVien.nhanVienDetail.tinh_trang_hon_nhan,
            chuc_vu: nhanVien.chuc_vu, 
            thoi_gian_cong_hien: nhanVien.thoi_gian_cong_hien,
            so_cccd:nhanVien.nhanVienCCCDDetail.so_cccd,
            ngay_cap_cccd:nhanVien.nhanVienCCCDDetail.ngay_cap_cccd,
            noi_cap_cccd:nhanVien.nhanVienCCCDDetail.noi_cap_cccd,
            ten_phong_ban:nhanVien.phongBanDetail?.ten_phong_ban,
            ma_phong_ban:nhanVien.phongBanDetail?._id
        }
        return nhanSu
    });
    return data;
}

const createOrUpdateNhanVien = async(nhanVien,chucVuCoQuan,nhanVienCccd) =>{
    if(!nhanVien.hasOwnProperty('_id')){
        const nhanVienMoi=new NhanVienModel(nhanVien);
        await nhanVienMoi.save()
        const nhan_vien_id=nhanVienMoi._id;
        if(!nhan_vien_id) return;
        const chucVuCoQuanMoi=new ChucVuCoQuanModel({nhan_vien_id,...chucVuCoQuan});
        await chucVuCoQuanMoi.save();
        const nhanVienCccdMoi=new NhanVienCCCDModel({nhan_vien_id,...nhanVienCccd});
        await nhanVienCccdMoi.save();
    }else{
        let nhanVienUpdate=await NhanVienModel.findById(nhanVien._id);
        Object.assign(nhanVienUpdate, nhanVien);

        let chucVuCoQuanUpdate=await ChucVuCoQuanModel.findOne({nhan_vien_id:nhanVien._id});
        if(chucVuCoQuan?.ma_phong_ban==null){
            let phongBan = await PhongBanModel.findById(chucVuCoQuanUpdate?.ma_phong_ban);
            if(phongBan?.ma_truong_phong==nhanVien._id){
                phongBan.ma_truong_phong=null;
                phongBan.save();
            }
        }
        Object.assign(chucVuCoQuanUpdate, chucVuCoQuan);
        let nhanVienCccdUpdate=await NhanVienCCCDModel.findOne({nhan_vien_id:nhanVien._id});
        Object.assign(nhanVienCccdUpdate, nhanVienCccd);
        await nhanVienUpdate.save();
        await chucVuCoQuanUpdate.save();   
        await nhanVienCccdUpdate.save();
    }
    
}
const removeNhanVien = async(id) =>{
    await NhanVienModel.findByIdAndDelete(id);
    await ChucVuCoQuanModel.findOneAndDelete({nhan_vien_id:id});
    await NhanVienCCCDModel.findOneAndDelete({nhan_vien_id:id});
}

const choNhanVienNghiViec = async(id) =>{
    const updatedDoc = await ChucVuCoQuanModel.findOneAndUpdate(
        { nhan_vien_id: id},
        { $set: { da_nghi_viec: true } },
        { new: true }
    );
}

const searchNhanVien = async(query) =>{
    const nhanViens=await ChucVuCoQuanModel.aggregate([
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
            from: 'phong_bans', 
            localField: 'ma_phong_ban',
            foreignField: '_id',
            as: 'phongBanDetail',
        },
        },
        {
            $unwind:  { path: '$phongBanDetail', preserveNullAndEmptyArrays: true },
        },
        {
        $lookup: {
            from: 'nhan_vien_cccds', 
            localField: 'nhan_vien_id',
            foreignField: 'nhan_vien_id',
            as: 'nhanVienCCCDDetail',
        },
        },
        {
        $unwind:  { path: '$nhanVienCCCDDetail', preserveNullAndEmptyArrays: true },
        },
        {
            $addFields: {
              phongBanDetailIdString: { $toString: '$phongBanDetail._id' }
            }
        },
        {
            $match: query,
        },
        {
            $project: {
              phongBanDetailIdString: 0 // Ẩn trường tạm thời
            }
          }
      ]);

      const result = nhanViens.map(nhanVien => {
        const nhanSu={
            _id:nhanVien.nhan_vien_id,
            ma_nhan_su: nhanVien.ma_nhan_su, 
            ten_nhan_su:nhanVien.nhanVienDetail.ten_nhan_su,
            gioi_tinh:nhanVien.nhanVienDetail.gioi_tinh,
            nam_sinh:nhanVien.nhanVienDetail.nam_sinh,
            noi_sinh:nhanVien.nhanVienDetail.noi_sinh,
            nguyen_quan:nhanVien.nhanVienDetail.nguyen_quan,
            dia_chi_hien_tai:nhanVien.nhanVienDetail.dia_chi_hien_tai,
            so_dien_thoai:nhanVien.nhanVienDetail.so_dien_thoai,
            dan_toc:nhanVien.nhanVienDetail.dan_toc,
            ton_giao:nhanVien.nhanVienDetail.ton_giao,
            trinh_do_van_hoa:nhanVien.nhanVienDetail.trinh_do_van_hoa,
            quoc_tich:nhanVien.nhanVienDetail.quoc_tich,
            tinh_trang_hon_nhan:nhanVien.nhanVienDetail.tinh_trang_hon_nhan,
            chuc_vu: nhanVien.chuc_vu, 
            thoi_gian_cong_hien: nhanVien.thoi_gian_cong_hien,
            so_cccd:nhanVien.nhanVienCCCDDetail.so_cccd,
            ngay_cap_cccd:nhanVien.nhanVienCCCDDetail.ngay_cap_cccd,
            noi_cap_cccd:nhanVien.nhanVienCCCDDetail.noi_cap_cccd,
            ten_phong_ban:nhanVien.phongBanDetail?.ten_phong_ban,
            ma_phong_ban:nhanVien.phongBanDetail?._id
        }

        return nhanSu

    });

    return result;
}

const getAllTenNhanVienChuaCoBangLuong = async() =>{
    const bangLuongs=await BangLuongModel.find();

    const nhanVienChuaCoBangLuongs = await ChucVuCoQuanModel.find({
        da_nghi_viec:false,
        nhan_vien_id: { $nin: bangLuongs?.map(bl => bl.nhan_vien_id) }
      }).populate('nhan_vien_id'); 
    const result = nhanVienChuaCoBangLuongs?.map( (nhanVien) =>{
        return {
          nhan_vien_id:nhanVien.nhan_vien_id._id,
          ma_nhan_su:nhanVien.ma_nhan_su,
          ten_nhan_su:nhanVien.nhan_vien_id.ten_nhan_su
        }
      }); 
    return result;
}

const countNhanVien = async() =>{
    return await ChucVuCoQuanModel.countDocuments({da_nghi_viec:false});
}






module.exports = {
    getNhanViens,
    createOrUpdateNhanVien,
    removeNhanVien,
    choNhanVienNghiViec,
    searchNhanVien,
    getAllTenNhanVienChuaCoBangLuong,
    countNhanVien
};