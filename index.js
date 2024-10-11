const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config')
const app = express();
const cors = require('cors');
const cron = require('node-cron');

const port = 3001;
const routes = require('./routes');
const chamCongService = require('./services/chamCong.service')

app.use(cors()); 
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

mongoose.connect(config.connectionString)
  .then(() => {
    console.log('MongoDB connected!');
    // Chỉ bắt đầu lắng nghe sau khi MongoDB kết nối thành công
    app.listen(config.port, () => {
      console.log(`Server is running on http://localhost:${config.port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Lập lịch add chấm công vào mỗi ngày lúc 0:00 giờ sáng

  cron.schedule('54 10 * * 1-5', async () => {
    const today = new Date();
    const day = today.getDay();

    if (day !== 6 && day !== 0) {
        await chamCongService.createChamCongs();
    }
}, {
    timezone: "Asia/Ho_Chi_Minh" // Đảm bảo công việc chạy theo múi giờ của bạn
});

app.use('/', routes); 