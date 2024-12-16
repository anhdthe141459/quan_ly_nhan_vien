const NhanVienModel = require("../models/nhanVien.model");
const ChucVuCoQuanModel = require("../models/chucVuCoQuan.model");
const NhanVienCCCDModel = require("../models/nhanVienCCCD.model");
const PhongBanModel = require("../models/phongBan.model");
const BangLuongModel = require("../models/bangLuong.model");
const { getAllNhanVienNotPhongBan } = require("./phongBan.service");

const getNhanViens = async (skip, limit, page) => {
  try {
    const total = await ChucVuCoQuanModel.countDocuments({
      da_nghi_viec: false,
    });
    let nhanVienChucVus = await ChucVuCoQuanModel.find({
      da_nghi_viec: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (total < 10) {
      nhanVienChucVus = await ChucVuCoQuanModel.find({
        da_nghi_viec: false,
      });
    }
    // Truy vấn các ChucVuCoQuanModel

    // Lấy danh sách các nhan_vien_id từ ChucVuCoQuanModel
    const nhanVienIds = nhanVienChucVus.map((item) => item.nhan_vien_id);

    // Truy vấn dữ liệu từ các collection khác
    const nhanViens = await NhanVienModel.find({
      _id: { $in: nhanVienIds },
    });

    const phongBanIds = nhanVienChucVus.map((item) => item.ma_phong_ban);
    const phongBans = await PhongBanModel.find({
      _id: { $in: phongBanIds },
    });

    const nhanVienCCCDs = await NhanVienCCCDModel.find({
      nhan_vien_id: { $in: nhanVienIds },
    });

    // Kết hợp dữ liệu lại
    const data = nhanVienChucVus.map((nhanVien) => {
      const nhanVienDetail = nhanViens.find(
        (nv) => nv._id.toString() === nhanVien.nhan_vien_id.toString()
      );
      const phongBanDetail = phongBans.find(
        (p) => p._id.toString() === nhanVien.ma_phong_ban.toString()
      );
      const nhanVienCCCDDetail = nhanVienCCCDs.find(
        (nv) => nv.nhan_vien_id.toString() === nhanVien.nhan_vien_id.toString()
      );

      return {
        _id: nhanVien.nhan_vien_id,
        ma_nhan_su: nhanVien.ma_nhan_su,
        ten_nhan_su: nhanVienDetail?.ten_nhan_su,
        gioi_tinh: nhanVienDetail?.gioi_tinh,
        nam_sinh: nhanVienDetail?.nam_sinh,
        noi_sinh: nhanVienDetail?.noi_sinh,
        nguyen_quan: nhanVienDetail?.nguyen_quan,
        dia_chi_hien_tai: nhanVienDetail?.dia_chi_hien_tai,
        so_dien_thoai: nhanVienDetail?.so_dien_thoai,
        dan_toc: nhanVienDetail?.dan_toc,
        ton_giao: nhanVienDetail?.ton_giao,
        trinh_do_van_hoa: nhanVienDetail?.trinh_do_van_hoa,
        quoc_tich: nhanVienDetail?.quoc_tich,
        tinh_trang_hon_nhan: nhanVienDetail?.tinh_trang_hon_nhan,
        chuc_vu: nhanVien.chuc_vu,
        thoi_gian_cong_hien: nhanVien.thoi_gian_cong_hien,
        so_cccd: nhanVienCCCDDetail?.so_cccd,
        ngay_cap_cccd: nhanVienCCCDDetail?.ngay_cap_cccd,
        noi_cap_cccd: nhanVienCCCDDetail?.noi_cap_cccd,
        ten_phong_ban: phongBanDetail?.ten_phong_ban,
        ma_phong_ban: phongBanDetail?._id,
      };
    });

    // Tính tổng số tài liệu

    // Trả về kết quả
    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu ChucVuCoQuan:", error.message);
    throw error;
  }
};

const getAvatarNhanVien = async (nhan_vien_id) => {
  return await NhanVienModel.findById(nhan_vien_id).select("avatar");
};

const createOrUpdateNhanVien = async (nhanVien, chucVuCoQuan, nhanVienCccd) => {
  if (!nhanVien.hasOwnProperty("_id")) {
    const nhanVienMoi = new NhanVienModel(nhanVien);
    await nhanVienMoi.save();
    const nhan_vien_id = nhanVienMoi._id;
    if (!nhan_vien_id) return;
    const chucVuCoQuanMoi = new ChucVuCoQuanModel({
      nhan_vien_id,
      ...chucVuCoQuan,
    });
    await chucVuCoQuanMoi.save();
    const nhanVienCccdMoi = new NhanVienCCCDModel({
      nhan_vien_id,
      ...nhanVienCccd,
    });
    await nhanVienCccdMoi.save();
  } else {
    let nhanVienUpdate = await NhanVienModel.findById(nhanVien._id);
    Object.assign(nhanVienUpdate, nhanVien);

    let chucVuCoQuanUpdate = await ChucVuCoQuanModel.findOne({
      nhan_vien_id: nhanVien._id,
    });
    if (chucVuCoQuan?.ma_phong_ban == null) {
      let phongBan = await PhongBanModel.findById(
        chucVuCoQuanUpdate?.ma_phong_ban
      );
      if (phongBan?.ma_truong_phong == nhanVien._id) {
        phongBan.ma_truong_phong = null;
        phongBan.save();
      }
    }
    Object.assign(chucVuCoQuanUpdate, chucVuCoQuan);
    let nhanVienCccdUpdate = await NhanVienCCCDModel.findOne({
      nhan_vien_id: nhanVien._id,
    });
    Object.assign(nhanVienCccdUpdate, nhanVienCccd);
    await nhanVienUpdate.save();
    await chucVuCoQuanUpdate.save();
    await nhanVienCccdUpdate.save();
  }
};
const removeNhanVien = async (id) => {
  await NhanVienModel.findByIdAndDelete(id);
  await ChucVuCoQuanModel.findOneAndDelete({ nhan_vien_id: id });
  await NhanVienCCCDModel.findOneAndDelete({ nhan_vien_id: id });
};

const choNhanVienNghiViec = async (id) => {
  const updatedDoc = await ChucVuCoQuanModel.findOneAndUpdate(
    { nhan_vien_id: id },
    { $set: { da_nghi_viec: true } },
    { new: true }
  );
};

const searchNhanVien = async (query, page, limit = 10) => {
  const skip = (page - 1) * limit;

  const nhanViens = await ChucVuCoQuanModel.aggregate([
    {
      $lookup: {
        from: "nhan_viens",
        localField: "nhan_vien_id",
        foreignField: "_id",
        as: "nhanVienDetail",
        pipeline: [
          {
            $project: {
              ten_nhan_su: 1,
              gioi_tinh: 1,
              nam_sinh: 1,
              noi_sinh: 1,
              nguyen_quan: 1,
              dia_chi_hien_tai: 1,
              so_dien_thoai: 1,
              dan_toc: 1,
              ton_giao: 1,
              trinh_do_van_hoa: 1,
              quoc_tich: 1,
              tinh_trang_hon_nhan: 1,
            },
          },
        ],
      },
    },
    { $unwind: { path: "$nhanVienDetail", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "phong_bans",
        localField: "ma_phong_ban",
        foreignField: "_id",
        as: "phongBanDetail",
        pipeline: [{ $project: { ten_phong_ban: 1 } }],
      },
    },
    { $unwind: { path: "$phongBanDetail", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "nhan_vien_cccds",
        localField: "nhan_vien_id",
        foreignField: "nhan_vien_id",
        as: "nhanVienCCCDDetail",
        pipeline: [
          { $project: { so_cccd: 1, ngay_cap_cccd: 1, noi_cap_cccd: 1 } },
        ],
      },
    },
    {
      $unwind: {
        path: "$nhanVienCCCDDetail",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        phongBanDetailIdString: { $toString: "$phongBanDetail._id" },
      },
    },
    { $match: query },
    {
      $facet: {
        totalCount: [{ $count: "total" }],
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              phongBanDetailIdString: 0,
              "nhanVienDetail.avatar": 0, // loại bỏ trường không cần thiết
            },
          },
        ],
      },
    },
  ]);

  const data = nhanViens[0].data.map((nhanVien) => ({
    _id: nhanVien.nhan_vien_id,
    ma_nhan_su: nhanVien.ma_nhan_su,
    ten_nhan_su: nhanVien.nhanVienDetail.ten_nhan_su,
    gioi_tinh: nhanVien.nhanVienDetail.gioi_tinh,
    nam_sinh: nhanVien.nhanVienDetail.nam_sinh,
    noi_sinh: nhanVien.nhanVienDetail.noi_sinh,
    nguyen_quan: nhanVien.nhanVienDetail.nguyen_quan,
    dia_chi_hien_tai: nhanVien.nhanVienDetail.dia_chi_hien_tai,
    so_dien_thoai: nhanVien.nhanVienDetail.so_dien_thoai,
    dan_toc: nhanVien.nhanVienDetail.dan_toc,
    ton_giao: nhanVien.nhanVienDetail.ton_giao,
    trinh_do_van_hoa: nhanVien.nhanVienDetail.trinh_do_van_hoa,
    quoc_tich: nhanVien.nhanVienDetail.quoc_tich,
    tinh_trang_hon_nhan: nhanVien.nhanVienDetail.tinh_trang_hon_nhan,
    chuc_vu: nhanVien.chuc_vu,
    thoi_gian_cong_hien: nhanVien.thoi_gian_cong_hien,
    so_cccd: nhanVien.nhanVienCCCDDetail.so_cccd,
    ngay_cap_cccd: nhanVien.nhanVienCCCDDetail.ngay_cap_cccd,
    noi_cap_cccd: nhanVien.nhanVienCCCDDetail.noi_cap_cccd,
    ten_phong_ban: nhanVien.phongBanDetail?.ten_phong_ban,
    ma_phong_ban: nhanVien.phongBanDetail?._id,
  }));

  const total = nhanViens[0].totalCount[0]
    ? nhanViens[0].totalCount[0].total
    : 0;

  return {
    data,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};

const downloadExcelNhanVien = async (query) => {
  const nhanViens = await ChucVuCoQuanModel.aggregate([
    {
      $lookup: {
        from: "nhan_viens",
        localField: "nhan_vien_id",
        foreignField: "_id",
        as: "nhanVienDetail",
      },
    },
    {
      $unwind: { path: "$nhanVienDetail", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "phong_bans",
        localField: "ma_phong_ban",
        foreignField: "_id",
        as: "phongBanDetail",
      },
    },
    {
      $unwind: { path: "$phongBanDetail", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "nhan_vien_cccds",
        localField: "nhan_vien_id",
        foreignField: "nhan_vien_id",
        as: "nhanVienCCCDDetail",
      },
    },
    {
      $unwind: {
        path: "$nhanVienCCCDDetail",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        phongBanDetailIdString: { $toString: "$phongBanDetail._id" },
      },
    },
    {
      $match: query,
    },
    {
      $project: {
        phongBanDetailIdString: 0, // Ẩn trường tạm thời
        "nhanVienDetail.avatar": 0,
      },
    },
  ]);

  const result = nhanViens.map((nhanVien) => {
    const nhanSu = {
      _id: nhanVien.nhan_vien_id,
      ma_nhan_su: nhanVien.ma_nhan_su,
      ten_nhan_su: nhanVien.nhanVienDetail.ten_nhan_su,
      gioi_tinh: nhanVien.nhanVienDetail.gioi_tinh,
      nam_sinh: nhanVien.nhanVienDetail.nam_sinh,
      noi_sinh: nhanVien.nhanVienDetail.noi_sinh,
      nguyen_quan: nhanVien.nhanVienDetail.nguyen_quan,
      dia_chi_hien_tai: nhanVien.nhanVienDetail.dia_chi_hien_tai,
      so_dien_thoai: nhanVien.nhanVienDetail.so_dien_thoai,
      dan_toc: nhanVien.nhanVienDetail.dan_toc,
      ton_giao: nhanVien.nhanVienDetail.ton_giao,
      trinh_do_van_hoa: nhanVien.nhanVienDetail.trinh_do_van_hoa,
      quoc_tich: nhanVien.nhanVienDetail.quoc_tich,
      tinh_trang_hon_nhan: nhanVien.nhanVienDetail.tinh_trang_hon_nhan,
      chuc_vu: nhanVien.chuc_vu,
      thoi_gian_cong_hien: nhanVien.thoi_gian_cong_hien,
      so_cccd: nhanVien.nhanVienCCCDDetail.so_cccd,
      ngay_cap_cccd: nhanVien.nhanVienCCCDDetail.ngay_cap_cccd,
      noi_cap_cccd: nhanVien.nhanVienCCCDDetail.noi_cap_cccd,
      ten_phong_ban: nhanVien.phongBanDetail?.ten_phong_ban,
      ma_phong_ban: nhanVien.phongBanDetail?._id,
    };

    return nhanSu;
  });

  return result;
};

const getAllTenNhanVienChuaCoBangLuong = async () => {
  const bangLuongs = await BangLuongModel.find();

  const nhanVienChuaCoBangLuongs = await ChucVuCoQuanModel.find({
    da_nghi_viec: false,
    nhan_vien_id: { $nin: bangLuongs?.map((bl) => bl.nhan_vien_id) },
  }).populate({
    path: "nhan_vien_id",
    select: "-avatar", // Dấu trừ (-) phía trước 'avatar' sẽ loại bỏ trường này khỏi kết quả
  });
  const result = nhanVienChuaCoBangLuongs?.map((nhanVien) => {
    return {
      nhan_vien_id: nhanVien.nhan_vien_id._id,
      ma_nhan_su: nhanVien.ma_nhan_su,
      ten_nhan_su: nhanVien.nhan_vien_id.ten_nhan_su,
    };
  });
  return result;
};

const countNhanVien = async () => {
  return await ChucVuCoQuanModel.countDocuments({ da_nghi_viec: false });
};

module.exports = {
  getNhanViens,
  getAvatarNhanVien,
  createOrUpdateNhanVien,
  removeNhanVien,
  choNhanVienNghiViec,
  searchNhanVien,
  getAllTenNhanVienChuaCoBangLuong,
  countNhanVien,
  downloadExcelNhanVien,
};
