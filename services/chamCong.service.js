const phongBanservice = require("./phongBan.service")
const ChamCongModel = require("../models/chamCong.model");
const ChucVuCoQuanModel = require("../models/chucVuCoQuan.model");
const NhanVienModel = require("../models/nhanVien.model");
const mongoose = require('mongoose');



const getChamCongMoiNgay = async (maPhongBan) => {
  const today = new Date().setHours(0, 0, 0, 0);

  // Fetch all employees in the specified department
  const allNhanVienChamCong = await phongBanservice.getAllNhanVienPhongBan(maPhongBan);
  
  // Prepare an array of employee IDs to batch-query attendance data
  const nhanVienIds = allNhanVienChamCong.map((nv) => new mongoose.Types.ObjectId(nv.nhan_vien_id));

  // Fetch all attendance records for employees in the specified department for today
  const chamCongRecords = await ChamCongModel.find({
    nhan_vien_id: { $in: nhanVienIds },
    ngay_cham_cong: today,
  }).lean(); // Use lean() to get plain JavaScript objects, reducing overhead

  // Create a map of attendance records by employee ID for fast lookup
  const chamCongMap = chamCongRecords.reduce((acc, record) => {
    acc[record.nhan_vien_id.toString()] = record;
    return acc;
  }, {});

  // Map over all employees and merge attendance data if available
  const data = allNhanVienChamCong.map((nhanVienChamCong) => {
    const chamCong = chamCongMap[nhanVienChamCong.nhan_vien_id];
    return {
      ...chamCong || {}, // Use chamCong if available, otherwise an empty object
      ten_nhan_su: nhanVienChamCong.ten_nhan_su,
      ma_nhan_su: nhanVienChamCong.ma_nhan_su,
      nhan_vien_id: nhanVienChamCong.nhan_vien_id,
    };
  });

  return data;
};


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
  if(chamCong.hasOwnProperty('_id')){
    Object.keys(chamCong).forEach(key => {
      if (chamCong[key] === null || chamCong[key] ==='') {
        delete chamCong[key];
      }
    });
    const existingChamCong = await ChamCongModel.findById(chamCong._id);
    if (!existingChamCong) {
    } else {
      const chamCongUpdate = await ChamCongModel.replaceOne(
        { _id: chamCong._id },
        chamCong, // Đối tượng mới thay thế
        { overwrite: true }
      );
    }

  }else{
    ChamCongModel.create(chamCong);
  }

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
  return await ChamCongModel.aggregate([
    {
      $match: {
        ngay_cham_cong: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
        nhan_vien_id: nhan_vien_id,
      },
    },
    {
      $group: {
        _id: null,
        tongSoGioLamViecChinhThuc: { $sum: '$so_gio_lam_viec' },
        tongSoGioLamThem: { $sum: '$so_gio_lam_them' },
      },
    },
  ]).project({ _id: 0 });
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

// const getChamCongNhanVienTheoThang = async(year, month) =>{

//     const nhanVienChucVu = await ChucVuCoQuanModel.find({da_nghi_viec:false}).select('ma_nhan_su nhan_vien_id ma_phong_ban');
    
//     const result = await Promise.all(nhanVienChucVu.map(async (nhanVien) => {
//       const tenNhanVien = await NhanVienModel.findById(nhanVien.nhan_vien_id).select('ten_nhan_su');
//       const chamCong = await getTongGioLamViecCuaNhanVienMoiThang(year, month,nhanVien.nhan_vien_id);
//       const trangThaiChamCong= await getTrangThaiCuaNhanVienMoiThang(year, month,nhanVien.nhan_vien_id);
//       return {
//         ...nhanVien._doc,
//         ten_nhan_su:tenNhanVien.ten_nhan_su,
//         trang_thai_co_mat:trangThaiChamCong?.co_mat,
//         trang_thai_nghi_co_phep:trangThaiChamCong?.nghi_co_phep,
//         trang_thai_nghi_khong_phep:trangThaiChamCong?.nghi_khong_phep,
//         ...chamCong["0"]??{tongSoGioLamViecChinhThuc:0, tongSoGioLamThem: 0},
//         tong_so_gio_lam:chamCong["0"] ? chamCong["0"].tongSoGioLamViecChinhThuc + chamCong["0"].tongSoGioLamThem:0,
//       };
//     }));

//     return result;
// }

const getChamCongNhanVienTheoThang = async (year, month) => {
  const [nhanVienChucVuList, nhanVienList] = await Promise.all([
    ChucVuCoQuanModel.find({ da_nghi_viec: false }).select('ma_nhan_su nhan_vien_id ma_phong_ban').lean(),
    NhanVienModel.find().select('ten_nhan_su').lean()
  ]);

  const nhanVienIds = nhanVienChucVuList.map((nv) => nv.nhan_vien_id);

  const chamCongData = await ChamCongModel.aggregate([
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
      $facet: {
        hours: [
          {
            $group: {
              _id: '$nhan_vien_id',
              tongSoGioLamViecChinhThuc: { $sum: '$so_gio_lam_viec' },
              tongSoGioLamThem: { $sum: '$so_gio_lam_them' },
            },
          },
        ],
        attendanceStatus: [
          {
            $group: {
              _id: { nhan_vien_id: '$nhan_vien_id', trang_thai: '$trang_thai' },
              count: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: '$_id.nhan_vien_id',
              counts: {
                $push: {
                  k: '$_id.trang_thai',
                  v: '$count',
                },
              },
            },
          },
          {
            $addFields: {
              counts: {
                $arrayToObject: {
                  $concatArrays: [
                    [
                      { k: 'co_mat', v: 0 },
                      { k: 'nghi_co_phep', v: 0 },
                      { k: 'nghi_khong_phep', v: 0 },
                    ],
                    '$counts',
                  ],
                },
              },
            },
          },
        ],
      },
    },
  ]);

  const { hours = [], attendanceStatus = [] } = chamCongData[0] || {};

  const hoursMap = Object.fromEntries(
    hours.map((h) => [h._id.toString(), h])
  );
  const attendanceStatusMap = Object.fromEntries(
    attendanceStatus.map((a) => [a._id.toString(), a.counts])
  );
  const nhanVienMap = Object.fromEntries(
    nhanVienList.map((nv) => [nv._id.toString(), nv.ten_nhan_su])
  );

  const result = nhanVienChucVuList.map((nhanVien) => {
    const tenNhanVien = nhanVienMap[nhanVien.nhan_vien_id] || '';
    const hours = hoursMap[nhanVien.nhan_vien_id] || { tongSoGioLamViecChinhThuc: 0, tongSoGioLamThem: 0 };
    const attendance = attendanceStatusMap[nhanVien.nhan_vien_id] || {
      co_mat: 0,
      nghi_co_phep: 0,
      nghi_khong_phep: 0,
    };

    return {
      ...nhanVien,
      ten_nhan_su: tenNhanVien,
      trang_thai_co_mat: attendance.co_mat,
      trang_thai_nghi_co_phep: attendance.nghi_co_phep,
      trang_thai_nghi_khong_phep: attendance.nghi_khong_phep,
      tongSoGioLamViecChinhThuc: hours.tongSoGioLamViecChinhThuc,
      tongSoGioLamThem: hours.tongSoGioLamThem,
      tong_so_gio_lam: hours.tongSoGioLamViecChinhThuc + hours.tongSoGioLamThem,
    };
  });

  return result;
};


const getChamCongNhanVienChiTietTheoThang = async(year, month, id) => {
    return await ChamCongModel.find({
        ngay_cham_cong: {
            $gte: new Date(year, month - 1, 1), 
            $lt:  new Date(year, month, 1)     
        },
        nhan_vien_id: id
    }).sort({ ngay_cham_cong: 1 });
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