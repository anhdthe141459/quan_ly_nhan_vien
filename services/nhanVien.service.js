const NhanVienModel = require('../models/nhanVien.model');
const ChucVuCoQuanModel = require('../models/chucVuCoQuan.model');
const NhanVienCCCDModel = require('../models/nhanVienCCCD.model');
const PhongBanModel = require('../models/phongBan.model');
const { getAllNhanVienNotPhongBan } = require('./phongBan.service');

const getNhanViens = async() =>{

    const nhanViens = await NhanVienModel.find();
    
    const result = await Promise.all(nhanViens.map(async (nhanVien) => {
      const nhanVienChucVu = await ChucVuCoQuanModel.findOne({ nhan_vien_id: nhanVien._id });
      const nhanVienCCCD = await NhanVienCCCDModel.findOne({ nhan_vien_id: nhanVien._id });
      const phongBan = await PhongBanModel.findById(nhanVienChucVu?.ma_phong_ban).select('ten_phong_ban');

      return {
        ...nhanVien._doc,
        nhanVienChucVu,      
        nhanVienCCCD,
        phongBan      
      };
    }));

    // const nhanVienChucVus= await ChucVuCoQuanModel.find().populate('nhan_vien_id');
    
    const data = result.map(nhanVien => {
        const nhanSu={
            _id:nhanVien._id,
            ten_nhan_su:nhanVien.ten_nhan_su,
            gioi_tinh:nhanVien.gioi_tinh,
            nam_sinh:nhanVien.nam_sinh,
            noi_sinh:nhanVien.noi_sinh,
            nguyen_quan:nhanVien.nguyen_quan,
            dia_chi_hien_tai:nhanVien.dia_chi_hien_tai,
            so_dien_thoai:nhanVien.so_dien_thoai,
            dan_toc:nhanVien.dan_toc,
            ton_giao:nhanVien.ton_giao,
            trinh_do_van_hoa:nhanVien.trinh_do_van_hoa,
            quoc_tich:nhanVien.quoc_tich,
            tinh_trang_hon_nhan:nhanVien.tinh_trang_hon_nhan,
            ma_nhan_su: nhanVien.nhanVienChucVu.ma_nhan_su, 
            chuc_vu: nhanVien.nhanVienChucVu.chuc_vu, 
            thoi_gian_cong_hien: nhanVien.nhanVienChucVu.thoi_gian_cong_hien,
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

const searchNhanVien = async(query) =>{
    const nhanViens= await NhanVienModel.find(query);
    return nhanViens;
}





module.exports = {
    getNhanViens,
    createOrUpdateNhanVien,
    removeNhanVien,
    searchNhanVien,
};