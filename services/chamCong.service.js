const phongBanservice = require("./phongBan.service")
const ChamCongModel = require("../models/chamCong.model");
const ChucVuCoQuanModel = require("../models/chucVuCoQuan.model");
const NhanVienModel = require("../models/nhanVien.model");

const getChamCongMoiNgay = async (maPhongBan) =>{
    const today = new Date().setHours(0, 0, 0, 0);
    const chamCongs = await ChamCongModel.find({ngay_cham_cong:today});
    const result = await Promise.all(chamCongs?.map(async (chamCong) => {
        const chucVuCoQuan = await ChucVuCoQuanModel.findOne({nhan_vien_id:chamCong.nhan_vien_id}).select('ma_nhan_su ma_phong_ban');
        const nhanViens = await NhanVienModel.findById(chamCong.nhan_vien_id).select('ten_nhan_su');
        return {
          ...chamCong?._doc,
          ten_nhan_su:nhanViens?.ten_nhan_su,
          ma_nhan_su:chucVuCoQuan.ma_nhan_su,
          ma_phong_ban:chucVuCoQuan.ma_phong_ban
        };
      }));
    if(maPhongBan=='all'){
        return result;
    }else{
        const chamCongTheoNgay = result.filter(item => item.ma_phong_ban==maPhongBan);
        return chamCongTheoNgay;
    }

} 

const createChamCongs = async() =>{
    const chamCongs = await getDataDeThemVaoChamCongHangNgay();
    ChamCongModel.insertMany(chamCongs)  
    .then((docs) => {
        return('success');
    })
    .catch((err) => {
        console.error('Error:', err);
        return('error');
    });
}

const updateChamCong = async(chamCong) =>{
    let chamCongUpdate=await ChamCongModel.findOne({nhan_vien_id:chamCong.nhan_vien_id});
    Object.assign(chamCongUpdate, chamCong);
    await chamCongUpdate.save();
}

const updateManyChamCong = async(chamCongs) =>{
    chamCongs?.map(chamCong => updateChamCong(chamCong));
}



const getDataDeThemVaoChamCongHangNgay = async () =>{
    const chamCongs= await phongBanservice.getAllNhanVienPhongBan('all');
    const today = new Date().setHours(0, 0, 0, 0);
    const listChamCongTheoNgay= chamCongs?.map( (chamCong) => {
        return{
            ...chamCong,
            ngay_cham_cong:today
        }
    });
    return listChamCongTheoNgay;
}

module.exports = {
    createChamCongs,
    updateManyChamCong,
    getChamCongMoiNgay
};