const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config");
const app = express();
const cors = require("cors");
const cron = require("node-cron");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const port = 3001;
const routes = require("./routes");
const chamCongService = require("./services/chamCong.service");
const phongBanService = require("./services/phongBan.service");
const xlsx = require("xlsx");
const { readMasterKey, CsfleHelper } = require("./helpers");

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:3000", // Thay thế bằng nguồn gốc chính xác của ứng dụng
    credentials: true, // Cho phép gửi kèm thông tin xác thực
  })
);
app.use(cookieParser());
// Middleware để parse JSON body
app.use(express.json({ limit: "10mb" }));

// Middleware để parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const localMasterKey = readMasterKey();
const connectionString = "mongodb://localhost:27017/quan_ly_nhan_vien";

const dataKey = "ktELujgWSzCtl/ziM7XVHw==";
const csfleHelper = new CsfleHelper({
  // The client expects a key management system to store and provide the application's master encryption key. For now, we will use a local master key, so they use the local KMS provider.
  kmsProviders: {
    local: {
      key: Buffer.from(localMasterKey, "base64"),
    },
  },
  connectionString,
});

let schemeMap = csfleHelper.createCsfleSchemaMaps(dataKey);
csfleHelper.getCsfleEnabledConnection(schemeMap);

// Lập lịch add chấm công vào mỗi ngày lúc 0:00 giờ sáng

cron.schedule(
  "00 0 * * 1-5",
  async () => {
    const today = new Date();
    const day = today.getDay();

    if (day !== 0) {
      await chamCongService.createChamCongs();
    }
  },
  {
    timezone: "Asia/Ho_Chi_Minh", // Đảm bảo công việc chạy theo múi giờ của bạn
  }
);

app.use("/", routes);
