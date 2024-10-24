const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config')
const app = express();
const cors = require('cors');
const cron = require('node-cron');
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const port = 3001;
const routes = require('./routes');
const chamCongService = require('./services/chamCong.service')
const phongBanService = require('./services/phongBan.service')
const xlsx = require('xlsx');
const ChamCongModel = require('./models/chamCong.model');

dotenv.config();

app.use(cors({
  origin: 'http://localhost:3000', // Thay thế bằng nguồn gốc chính xác của ứng dụng
  credentials: true // Cho phép gửi kèm thông tin xác thực
}));
app.use(cookieParser());
// Middleware để parse JSON body
app.use(express.json());

// Middleware để parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('MongoDB connected!');
    // Chỉ bắt đầu lắng nghe sau khi MongoDB kết nối thành công
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Lập lịch add chấm công vào mỗi ngày lúc 0:00 giờ sáng

  cron.schedule('00 0 * * 1-5', async () => {
    const today = new Date();
    const day = today.getDay();

    if (day !== 0) {
        await chamCongService.createChamCongs();
    }
}, {
    timezone: "Asia/Ho_Chi_Minh" // Đảm bảo công việc chạy theo múi giờ của bạn
});

// function getWorkingDaysInMonth(year, month) {
//   // Tạo mảng để chứa kết quả
//   const workingDays = [];

//   // Lặp qua từng ngày trong tháng
//   const date = new Date(year, month - 1, 1); // Tháng trong JavaScript bắt đầu từ 0
//   while (date.getMonth() === month - 1 && date.getDate() < 28) {
//       // Kiểm tra xem có phải thứ 7 hoặc chủ nhật không
//       const dayOfWeek = date.getDay();
//       if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0: Chủ nhật, 6: Thứ 7
//           // Nếu không phải, thêm vào mảng
//           workingDays.push(new Date(date).setHours(0, 0, 0, 0));
//       }
//       // Chuyển sang ngày tiếp theo
//       date.setDate(date.getDate() + 1);
//   }

//   return workingDays;
// }
// app.post('/api/records', async (req, res) => {
//   try {
//     const chamCongs= await phongBanService.getAllNhanVienPhongBan('all');

//     const today = new Date().setHours(0, 0, 0, 0);
//       // Lấy ngày hiện tại
//       const now = new Date();
//       const year = now.getFullYear();
//       const month = now.getMonth(); // 0-11

//       // Tạo mảng chứa tất cả các ngày trong tháng hiện tại
//       const daysInMonth = getWorkingDaysInMonth(year,month+1);


//       chamCongs.forEach((nhanVien) => {
//         daysInMonth.forEach((today)=>{
//           const chamCongMoi=new ChamCongModel({
//             nhan_vien_id:nhanVien.nhan_vien_id,
//             ngay_cham_cong:today,
//             trang_thai:'co_mat',
//             gio_vao:new Date("2024-10-24T01:00:00.000Z"),
//             gio_ra:new Date("2024-10-24T10:00:00.000Z"),
//             so_gio_lam_them:0,
//             so_gio_lam_viec:8,
//           });
//           chamCongMoi.save();
//         })
//       });
      
//   } catch (error) {
//       res.status(500).json({ message: error.message });
//   }
// });


app.use('/', routes); 