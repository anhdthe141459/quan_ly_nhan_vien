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
    Object.keys(chamCong).forEach(key => {
        if (chamCong[key] === null || chamCong[key] ==='') {
          delete chamCong[key];
        }
      });
    chamCongUpdate= ChamCongModel.replaceOne(
      { _id: chamCong._id},
      chamCong, // Đối tượng mới để thay thế
      { overwrite: true } // `new: true` để trả về tài liệu sau khi cập nhật, `overwrite: true` để thay thế hoàn toàn
    ).then(updatedDoc => {
      if (updatedDoc) {
        console.log("Cập nhật thành công:", updatedDoc);
      } else {
        console.log("Không tìm thấy tài liệu nào để cập nhật.");
      }
    })
    .catch(err => {
      console.error("Lỗi khi cập nhật:", err);
    });
 }

const updateManyChamCong = async(chamCongs) =>{
    await Promise.all(chamCongs?.map((chamCong) => updateChamCong(chamCong)))
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

async function getTongGioLamViecCuaNhanVienMoiThang(year, month, nhan_vien_id) {
    const result = await ChamCongModel.aggregate([
      {
        // Lọc các tài liệu theo tháng, năm và mã nhân viên đã cho
        $match: {
            ngay_cham_cong: {
            $gte: new Date(year, month - 1, 1), // Ngày đầu tiên của tháng
            $lt: new Date(year, month, 1), // Ngày đầu tiên của tháng tiếp theo
          },
          nhan_vien_id: nhan_vien_id, // Hoặc dùng String nếu nhan_vien_id là kiểu String
        },
      },
      {
        // Nhóm các kết quả lại để tính tổng theo mã nhân viên
        $group: {
          _id: null,
          tongSoGioLamViec: { $sum: '$so_gio_lam_viec' },
          tongSoGioLamThem: { $sum: '$so_gio_lam_them' },
        },
      },
      {
        // Định dạng lại kết quả đầu ra
        $project: {
          _id: 0,
          tongSoGioLamViec: 1,
          tongSoGioLamThem: 1,
        },
      },
    ]);
    return result
  }

  async function getTrangThaiCuaNhanVienMoiThang(year, month, id) {
    const nhanVien = await ChucVuCoQuanModel.findOne({nhan_vien_id:id});
    const result = await ChamCongModel.aggregate([
      {
        // Lọc các tài liệu theo tháng, năm và mã nhân viên đã cho
        $match: {
            ngay_cham_cong: {
            $gte: new Date(year, month - 1, 1), // Ngày đầu tiên của tháng
            $lt: new Date(year, month, 1), // Ngày đầu tiên của tháng tiếp theo
          },
          // status: { $in: ['co_mat', 'nghi_co_phep','nghi_khong_phep'] },
          nhan_vien_id: nhanVien.nhan_vien_id,
        },
      },
      {
        // Nhóm các kết quả lại để tính tổng theo mã nhân viên
        $group: {
          _id: '$trang_thai',
          count: { $sum: 1 },
        },
      },
    ]);
          
    const counts = {
      co_mat: 0,
      nghi_co_phep: 0,
      nghi_khong_phep: 0
    };
   
    result.forEach(item => {
      if (item._id === 'co_mat') {
        counts.co_mat = item.count;
      } else if (item._id === 'nghi_co_phep' ||item._id ==null ) {
        counts.nghi_co_phep = item.count;
      }else if (item._id === 'nghi_khong_phep') {
        counts.nghi_khong_phep = item.count;
      }
    });
    return counts
  }

const getChamCongNhanVienTheoThang = async(year, month) =>{

    const nhanVienChucVu = await ChucVuCoQuanModel.find({da_nghi_viec:false}).select('ma_nhan_su nhan_vien_id');
    
    const result = await Promise.all(nhanVienChucVu.map(async (nhanVien) => {
      const tenNhanVien = await NhanVienModel.findById(nhanVien.nhan_vien_id).select('ten_nhan_su');
      const chamCong = await getTongGioLamViecCuaNhanVienMoiThang(year, month,nhanVien.nhan_vien_id);
      return {
        ...chamCong["0"]??{tongSoGioLamViec:0, tongSoGioLamThem: 0},
        ...nhanVien._doc,
        ten_nhan_su:tenNhanVien.ten_nhan_su,
      };
    }));

    return result;
}

const getChamCongNhanVienChiTietTheoThang = async(year, month, id) => {
    return await ChamCongModel.find({
        ngay_cham_cong: {
            $gte: new Date(year, month - 1, 1), 
            $lt:  new Date(year, month, 1)     
        },
        nhan_vien_id: id
    });
}

module.exports = {
    createChamCongs,
    updateManyChamCong,
    getChamCongMoiNgay,
    getChamCongNhanVienTheoThang,
    getChamCongNhanVienChiTietTheoThang,
    getTrangThaiCuaNhanVienMoiThang,
    getTongGioLamViecCuaNhanVienMoiThang
};