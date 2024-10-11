const NhanVienModel = require('../models/nhanVien.model');
const ChucVuCoQuanModel = require('../models/chucVuCoQuan.model');
const NhanVienCCCDModel = require('../models/nhanVienCCCD.model');
const PhongBanModel = require('../models/phongBan.model');
const BangLuongModel = require('../models/bangLuong.model');
const { getAllNhanVienNotPhongBan } = require('./phongBan.service');

const getNhanViens = async() =>{

    
    const nhanVienChucVus = await ChucVuCoQuanModel.find({da_nghi_viec:false });
      const result = await Promise.all(nhanVienChucVus.map(async (nhanVien) => {
      const nhanViens = await NhanVienModel.findById(nhanVien.nhan_vien_id);
      const nhanVienCCCD = await NhanVienCCCDModel.findOne({ nhan_vien_id: nhanVien.nhan_vien_id });
      const phongBan = await PhongBanModel.findById(nhanVien?.ma_phong_ban).select('ten_phong_ban');

      return {
        ...nhanVien._doc,
        nhanViens,      
        nhanVienCCCD,
        phongBan      
      };
    }));

    const data = result.map(nhanVien => {
        const nhanSu={
            _id:nhanVien.nhan_vien_id,
            ten_nhan_su:nhanVien.nhanViens.ten_nhan_su,
            gioi_tinh:nhanVien.nhanViens.gioi_tinh,
            nam_sinh:nhanVien.nhanViens.nam_sinh,
            noi_sinh:nhanVien.nhanViens.noi_sinh,
            nguyen_quan:nhanVien.nhanViens.nguyen_quan,
            dia_chi_hien_tai:nhanVien.nhanViens.dia_chi_hien_tai,
            so_dien_thoai:nhanVien.nhanViens.so_dien_thoai,
            dan_toc:nhanVien.nhanViens.dan_toc,
            ton_giao:nhanVien.nhanViens.ton_giao,
            trinh_do_van_hoa:nhanVien.nhanViens.trinh_do_van_hoa,
            quoc_tich:nhanVien.nhanViens.quoc_tich,
            tinh_trang_hon_nhan:nhanVien.nhanViens.tinh_trang_hon_nhan,
            ma_nhan_su: nhanVien.ma_nhan_su, 
            chuc_vu: nhanVien.chuc_vu, 
            thoi_gian_cong_hien: nhanVien.thoi_gian_cong_hien,
            so_cccd:nhanVien.nhanVienCCCD.so_cccd,
            ngay_cap_cccd:nhanVien.nhanVienCCCD.ngay_cap_cccd,
            noi_cap_cccd:nhanVien.nhanVienCCCD.noi_cap_cccd,
            ten_phong_ban:nhanVien.phongBan?.ten_phong_ban,
            ma_phong_ban:nhanVien.phongBan?.ma_phong_ban
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
    const nhanViens= await NhanVienModel.find(query);
    return nhanViens;
}

const getAllTenNhanVienChuaCoBangLuong = async() =>{
    const bangLuongs=await BangLuongModel.find();

    const nhanVienChuaCoBangLuongs = await ChucVuCoQuanModel.find({
        da_nghi_viec:false,
        nhan_vien_id: { $nin: bangLuongs?.map(bl => bl.nhan_vien_id) } // Lấy mảng nhan_vien_id từ bangLuongs
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




module.exports = {
    getNhanViens,
    createOrUpdateNhanVien,
    removeNhanVien,
    choNhanVienNghiViec,
    searchNhanVien,
    getAllTenNhanVienChuaCoBangLuong
};