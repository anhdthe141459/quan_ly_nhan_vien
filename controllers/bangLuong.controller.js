const bangLuongService = require('../services/bangLuong.service');
const excelService = require('../services/excel.service');

const getBangLuongChoNhanViens = async (req, res) => {
    try {
      const bangLuongs = await bangLuongService.getBangLuongChoNhanViens();
      res.json(bangLuongs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
const createOrUpdateBangLuong = async (req, res) => {
    try {
      const {bangLuong}=req.body;
      await bangLuongService.createOrUpdateBangLuong(bangLuong);
      res.json('success');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const getLuongNhanVienTheoThang = async (req, res) => {
  try {
    const { year, month } = req.query;
    const bangLuongs= await bangLuongService.getLuongNhanVienTheoThang(year,month);
    res.json(bangLuongs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchBangLuong = async (req, res) => {
  try {
    const { query } = req;

    const searchQuery = {};
    searchQuery['chucVuNhanVienDetail.da_nghi_viec'] = false;
    if (query.ma_nhan_su !== 'undefined') {
      searchQuery['chucVuNhanVienDetail.ma_nhan_su'] = { $regex: query.ma_nhan_su, $options: 'i' };
    }

    if (query.ten_nhan_su !== 'undefined') {
      searchQuery['nhanVienDetail.ten_nhan_su'] = { $regex: query.ten_nhan_su, $options: 'i' };
    }

    const bangLuongs= await bangLuongService.searchBangLuong(searchQuery);
    res.json(bangLuongs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const downloadExcelBangLuong = async (req, res) => {
  try {
    const bangLuongs = await bangLuongService.getBangLuongChoNhanViens();
    const data =[
      ['Mã nhân sự','Tên nhân sự','Lương cơ bản','Phụ cấp','Khấu trừ',"Ngày trả lương định kỳ"],
      ...bangLuongs.map(({_id,createdAt,__v,nhan_vien_id,...item}) =>{
        return Object.values({
          ...item,
        })
      }),
    ]
    const excelBuffer = await excelService.downloadExcel(data);
    res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // Send the buffer as the response
    res.send(excelBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadExcelThongKeLuongTheoThang = async (req, res) => {
  try {
    const { year, month } = req.query;
    const bangLuongs= await bangLuongService.getLuongNhanVienTheoThang(year,month);
    const data =[
      ['Mã nhân sự','Tên nhân sự','Tiền lương cơ bản','Tổng số công giờ làm','Tiền lương thực nhận',"Ngày trả lương định kỳ"],
      ...bangLuongs.map(({_id,nhan_vien_id,...item}) =>{
        return Object.values({
          ...item,
        })
      }),
    ]
    const excelBuffer = await excelService.downloadExcel(data);
    res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // Send the buffer as the response
    res.send(excelBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    createOrUpdateBangLuong,
    getBangLuongChoNhanViens,
    getLuongNhanVienTheoThang,
    searchBangLuong,
    downloadExcelBangLuong,
    downloadExcelThongKeLuongTheoThang
};