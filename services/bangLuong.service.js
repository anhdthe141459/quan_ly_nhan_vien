const BangLuongModel = require("../models/bangLuong.model");
const ChucVuCoQuanModel = require("../models/chucVuCoQuan.model");
const NhanVienModel = require("../models/nhanVien.model");
const ChamCongModel = require("../models/chamCong.model");
const chamCongService = require('./chamCong.service');

const getBangLuongChoNhanViens = async () => {
  // Lấy tất cả các bản ghi từ bảng lương
  const bangLuongs = await BangLuongModel.find();

  // Lấy tất cả các nhan_vien_id từ bảng lương
  const nhanVienIds = bangLuongs.map(bangLuong => bangLuong.nhan_vien_id);

  // Truy vấn một lần cho tất cả nhân viên liên quan
  const nhanViens = await NhanVienModel.find({ _id: { $in: nhanVienIds } }).select('ten_nhan_su');
  const nhanVienMap = nhanViens.reduce((acc, nhanVien) => {
    acc[nhanVien._id] = nhanVien;
    return acc;
  }, {});

  // Truy vấn một lần cho tất cả chức vụ liên quan mà nhân viên chưa nghỉ việc
  const nhanVienChucVus = await ChucVuCoQuanModel.find({ nhan_vien_id: { $in: nhanVienIds }, da_nghi_viec: false }).select('nhan_vien_id ma_nhan_su');
  const chucVuMap = nhanVienChucVus.reduce((acc, chucVu) => {
    acc[chucVu.nhan_vien_id] = chucVu;
    return acc;
  }, {});

  // Kết hợp dữ liệu từ các kết quả
  const result = bangLuongs.map(bangLuong => {
    const nhanVien = nhanVienMap[bangLuong.nhan_vien_id];
    const nhanVienChucVu = chucVuMap[bangLuong.nhan_vien_id];

    if (nhanVienChucVu) {
      return {
        ten_nhan_su: nhanVien?.ten_nhan_su,
        ma_nhan_su: nhanVienChucVu?.ma_nhan_su,
        ...bangLuong._doc, 
      };
    }
    return null;
  });

  // Lọc bỏ các kết quả null
  return result.filter(item => item !== null);
};

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


// const getLuongNhanVienTheoThang = async (year, month) => {
//   // Get active employees with necessary fields
//   const nhanVienChucVuList = await ChucVuCoQuanModel.find({ da_nghi_viec: false })
//     .select('ma_nhan_su nhan_vien_id ma_phong_ban')
//     .lean();

//   // Get all employee IDs from nhanVienChucVuList
//   const nhanVienIds = nhanVienChucVuList.map((nv) => nv.nhan_vien_id);

//   // Fetch BangLuong and NhanVien data in bulk
//   const bangLuongList = await BangLuongModel.find({ nhan_vien_id: { $in: nhanVienIds } })
//     .select('nhan_vien_id tien_luong phu_cap khau_tru ngay_tra_luong')
//     .lean();
//   const nhanVienList = await NhanVienModel.find({ _id: { $in: nhanVienIds } })
//     .select('ten_nhan_su')
//     .lean();

//   // Map bangLuong and nhanVien data by nhan_vien_id for faster lookup
//   const bangLuongMap = Object.fromEntries(bangLuongList.map((bl) => [bl.nhan_vien_id.toString(), bl]));
//   const nhanVienMap = Object.fromEntries(nhanVienList.map((nv) => [nv._id.toString(), nv]));

//   // Process each nhanVien with the preloaded data
//   const result = await Promise.all(nhanVienChucVuList.map(async (nhanVien) => {
//     const bangLuong = bangLuongMap[nhanVien.nhan_vien_id];
//     const tenNhanVien = nhanVienMap[nhanVien.nhan_vien_id]?.ten_nhan_su;

//     if (bangLuong && tenNhanVien) {
//       // Get total working hours for the month
//       console.log("test111111111111111111111")
//       const tongSoGioLamViecNhanVien = await chamCongService.getTongGioLamViecCuaNhanVienMoiThang(year, month, nhanVien.nhan_vien_id);
//       console.log("test222222222222222222222")
//       let tongSoLuongThucNhanNhanVien = 0;
//       let tongSoCongNhanVien = 0;

//       if (tongSoGioLamViecNhanVien[0]) {
//         tongSoCongNhanVien = tongSoGioLamViecNhanVien[0].tongSoGioLamViecChinhThuc + tongSoGioLamViecNhanVien[0].tongSoGioLamThem;
//         const soLuongTheoGioNhanVien = bangLuong.tien_luong / 160;
//         tongSoLuongThucNhanNhanVien = (soLuongTheoGioNhanVien * tongSoCongNhanVien) + bangLuong.phu_cap - bangLuong.khau_tru;
//       }

//       return {
//         ...nhanVien,
//         ten_nhan_su: tenNhanVien,
//         tien_luong_co_ban: bangLuong.tien_luong,
//         tongSoCongNhanVien,
//         tien_luong_thuc_nhan: tongSoLuongThucNhanNhanVien,
//         ngay_tra_luong: bangLuong.ngay_tra_luong,
//       };
//     } else {
//       return null;
//     }
//   }));

//   // Filter out null results
//   return result.filter(item => item !== null);
// };

const getLuongNhanVienTheoThang = async (year, month) => {
  // Get active employees with necessary fields
  const nhanVienChucVuList = await ChucVuCoQuanModel.find({ da_nghi_viec: false })
    .select('ma_nhan_su nhan_vien_id ma_phong_ban')
    .lean();

  const nhanVienIds = nhanVienChucVuList.map((nv) => nv.nhan_vien_id);

  // Fetch BangLuong, NhanVien, and ChamCong data in bulk
  const bangLuongList = await BangLuongModel.find({ nhan_vien_id: { $in: nhanVienIds } })
    .select('nhan_vien_id tien_luong phu_cap khau_tru ngay_tra_luong')
    .lean();
  const nhanVienList = await NhanVienModel.find({ _id: { $in: nhanVienIds } })
    .select('ten_nhan_su')
    .lean();
  const chamCongList = await ChamCongModel.aggregate([
    {
      $match: {
        ngay_cham_cong: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
        nhan_vien_id: { $in: nhanVienIds },
      },
    },
    {
      $group: {
        _id: '$nhan_vien_id',
        tongSoGioLamViecChinhThuc: { $sum: '$so_gio_lam_viec' },
        tongSoGioLamThem: { $sum: '$so_gio_lam_them' },
      },
    },
  ]);

  // Map data for faster lookup
  const bangLuongMap = Object.fromEntries(bangLuongList.map((bl) => [bl.nhan_vien_id.toString(), bl]));
  const nhanVienMap = Object.fromEntries(nhanVienList.map((nv) => [nv._id.toString(), nv]));
  const chamCongMap = Object.fromEntries(chamCongList.map((cc) => [cc._id.toString(), cc]));

  // Construct the result array by combining all necessary data
  const result = nhanVienChucVuList.map((nhanVien) => {
    const bangLuong = bangLuongMap[nhanVien.nhan_vien_id];
    const tenNhanVien = nhanVienMap[nhanVien.nhan_vien_id]?.ten_nhan_su;
    const chamCong = chamCongMap[nhanVien.nhan_vien_id] || { tongSoGioLamViecChinhThuc: 0, tongSoGioLamThem: 0 };

    if (bangLuong && tenNhanVien) {
      const tongSoCongNhanVien = chamCong.tongSoGioLamViecChinhThuc + chamCong.tongSoGioLamThem;
      const soLuongTheoGioNhanVien = bangLuong.tien_luong / 160;
      const tongSoLuongThucNhanNhanVien =
        (soLuongTheoGioNhanVien * tongSoCongNhanVien) + bangLuong.phu_cap - bangLuong.khau_tru;

      return {
        ...nhanVien,
        ten_nhan_su: tenNhanVien,
        tien_luong_co_ban: bangLuong.tien_luong,
        tongSoCongNhanVien,
        tien_luong_thuc_nhan: tongSoLuongThucNhanNhanVien,
        ngay_tra_luong: bangLuong.ngay_tra_luong,
      };
    } else {
      return null;
    }
  });

  return result.filter((item) => item !== null);
};


const searchBangLuong = async (query) => {
  const bangLuongs = await BangLuongModel.aggregate([
    {
      $lookup: {
        from: 'nhan_viens',
        localField: 'nhan_vien_id',
        foreignField: '_id',
        as: 'nhanVienDetail',
      },
    },
    { $unwind: { path: '$nhanVienDetail', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'chuc_vu_co_quans',
        localField: 'nhan_vien_id',
        foreignField: 'nhan_vien_id',
        as: 'chucVuNhanVienDetail',
      },
    },
    { $unwind: { path: '$chucVuNhanVienDetail', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'phong_bans',
        localField: 'chucVuNhanVienDetail.ma_phong_ban',
        foreignField: '_id',
        as: 'phongBanDetail',
      },
    },
    { $unwind: { path: '$phongBanDetail', preserveNullAndEmptyArrays: true } },
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
        _id: 1,
        nhan_vien_id: 1,
        tien_luong: 1,
        phu_cap: 1,
        khau_tru: 1,
        ngay_tra_luong: 1,
        'chucVuNhanVienDetail.ma_nhan_su': 1,
        'nhanVienDetail.ten_nhan_su': 1,
      }
    }
  ]);

  return bangLuongs.map(bangLuong => ({
    ma_nhan_su: bangLuong.chucVuNhanVienDetail?.ma_nhan_su,
    ten_nhan_su: bangLuong.nhanVienDetail?.ten_nhan_su,
    tien_luong: bangLuong.tien_luong,
    phu_cap: bangLuong.phu_cap,
    khau_tru: bangLuong.khau_tru,
    ngay_tra_luong: bangLuong.ngay_tra_luong
  }));
};
  

module.exports = {
  createOrUpdateBangLuong,
  getBangLuongChoNhanViens, 
  getLuongNhanVienTheoThang,
  searchBangLuong,
};