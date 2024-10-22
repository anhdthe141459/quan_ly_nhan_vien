const chamCongService = require('../services/chamCong.service');
const excelService = require('../services/excel.service');

const createChamCongs = async (req, res) => {
    try {
      const {chamCongs}=req.body;
      await chamCongService.updateManyChamCong(chamCongs);
      res.json('success');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const getChamCongMoiNgay = async (req, res) => {
  try {
    const {maPhongBan}=req.params;
    const chamCongMoiNgays = await chamCongService.getChamCongMoiNgay(maPhongBan);
    res.json(chamCongMoiNgays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getChamCongNhanVienTheoThang = async (req, res) => {
  try {
    const { year, month } = req.query;
    const chamCongs= await chamCongService.getChamCongNhanVienTheoThang(year,month);
    res.json(chamCongs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getTrangThaiCuaNhanVienMoiThang = async (req, res) => {
  try {
    const { year, month, id } = req.query;
    const chamCongs= await chamCongService.getTrangThaiCuaNhanVienMoiThang(year,month,id);
    res.json(chamCongs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChamCongNhanVienChiTietTheoThang = async (req, res) => {
  try {
    const { year, month, id } = req.query;
    const chamCongs= await chamCongService.getChamCongNhanVienChiTietTheoThang(year,month,id);
    res.json(chamCongs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadExcelThongKeChamCongTheoThang = async (req, res) => {
  try {
    const { year, month } = req.query;
    const chamCongs= await chamCongService.getChamCongNhanVienTheoThang(year,month);
    const data =[
      ['Mã nhân sự','Tên nhân sự','Số ngày đi làm','Số ngày nghỉ có phép','Số ngày nghỉ không phép',"Số giờ làm việc chính thức","Số giờ làm thêm",'Tổng số giờ làm được trong tháng'],
      ...chamCongs.map(({_id,nhan_vien_id,...item}) =>{
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
    createChamCongs,
    getChamCongMoiNgay,
    getChamCongNhanVienTheoThang,
    getChamCongNhanVienChiTietTheoThang,
    getTrangThaiCuaNhanVienMoiThang,
    downloadExcelThongKeChamCongTheoThang
};