const NhanVienModel = require('../models/nhanVien.model');
const ChucVuCoQuanModel = require('../models/chucVuCoQuan.model');
const NhanVienCCCDModel = require('../models/nhanVienCCCD.model');
const PhongBanModel =require('../models/phongBan.model');
const mongoose = require('mongoose');
const BangLuongModel = require('../models/bangLuong.model');
const ChamCongModel = require('../models/chamCong.model');
const fs = require('fs');
const { spawn } = require('child_process');

function randomDateInCurrentYear() {
    const start = new Date(new Date().getFullYear(), 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  function randomVietnameseNameWithGender() {
    const ho = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
    const tenDemNam = ["Văn", "Hữu", "Quốc", "Gia", "Minh", "Đức", "Hải", "Thái", "Xuân"];
    const tenDemNu = ["Thị", "Ngọc", "Gia", "Bích", "Hồng", "Kim", "Minh", "Hoài", "Thu"];
    const tenNam = ["Anh", "Bình", "Cường", "Dũng", "Huy", "Khánh", "Nam", "Phong", "Quân", "Sơn", "Vinh"];
    const tenNu = ["Lan", "Linh", "Mai", "Trang", "Thảo", "Vy", "Yến", "Hà", "Hương", "Thu", "My"];
  
    // Xác định giới tính ngẫu nhiên
    const gender = Math.random() > 0.5 ? "male" : "female";
  
    // Chọn ngẫu nhiên họ
    const randomHo = ho[Math.floor(Math.random() * ho.length)];
  
    let randomTenDem, randomTen;
  
    // Chọn tên đệm và tên dựa trên giới tính
    if (gender === "male") {
      randomTenDem = tenDemNam[Math.floor(Math.random() * tenDemNam.length)];
      randomTen = tenNam[Math.floor(Math.random() * tenNam.length)];
    } else {
      randomTenDem = tenDemNu[Math.floor(Math.random() * tenDemNu.length)];
      randomTen = tenNu[Math.floor(Math.random() * tenNu.length)];
    }
  
    return {
      ten: `${randomHo} ${randomTenDem} ${randomTen}`,
      gioiTinh: gender
    };
  }

  function randomLocationInVietnam() {
    const locations = [
      "Hà Nội", "Hải Phòng", "Đà Nẵng", "TP Hồ Chí Minh", "Cần Thơ",
      "Quảng Ninh", "Bắc Ninh", "Hải Dương", "Nam Định", "Thái Bình",
      "Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Quảng Bình", "Huế",
      "Quảng Nam", "Quảng Ngãi", "Bình Định", "Phú Yên", "Khánh Hòa",
      "Ninh Thuận", "Bình Thuận", "Lâm Đồng", "Đắk Lắk", "Gia Lai",
      "Đồng Nai", "Bình Dương", "Vũng Tàu", "An Giang", "Đồng Tháp",
      "Kiên Giang", "Bến Tre", "Tiền Giang", "Vĩnh Long", "Trà Vinh",
      "Sóc Trăng", "Bạc Liêu", "Cà Mau", "Lạng Sơn", "Hà Giang",
      "Lào Cai", "Yên Bái", "Điện Biên", "Sơn La", "Lai Châu",
      "Thái Nguyên", "Tuyên Quang", "Phú Thọ", "Ninh Bình", "Hòa Bình"
    ];
  
    // Chọn ngẫu nhiên một địa điểm từ mảng locations
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
  
    return randomLocation;
  }

  function randomBirthDate(minYear, maxYear) {
    // const minYear = 1900;
    // const maxYear = 1999;
  
    // Tạo năm ngẫu nhiên trong khoảng từ 1900 đến 1999
    const year = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
  
    // Tạo tháng ngẫu nhiên từ 0 đến 11 (tháng 0 là tháng 1, tháng 11 là tháng 12)
    const month = Math.floor(Math.random() * 12);
  
    // Tạo ngày ngẫu nhiên từ 1 đến ngày cuối của tháng đó
    const day = Math.floor(Math.random() * (new Date(year, month + 1, 0).getDate())) + 1;
  
    // Trả về đối tượng Date
    return new Date(year, month, day);
  }

  function randomPhoneNumber() {
    // Các đầu số phổ biến của Việt Nam (10 chữ số)
    const prefixes = ["086", "096", "097", "098", "032", "033", "034", "035", "036", "037", "038", "039", 
                      "070", "079", "077", "076", "078", "083", "084", "085", "081", "082", "056", "058"];
  
    // Chọn ngẫu nhiên một đầu số
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  
    // Tạo 7 chữ số ngẫu nhiên còn lại
    let randomDigits = '';
    for (let i = 0; i < 7; i++) {
      randomDigits += Math.floor(Math.random() * 10);
    }
  
    // Ghép đầu số và 7 chữ số ngẫu nhiên
    return randomPrefix + randomDigits;
  }

  function generateRandomCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomLetters = '';
    
    for (let i = 0; i < 2; i++) {
      randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    const randomNumbers = Math.floor(100000 + Math.random() * 900000).toString();
  
    let result = randomLetters + randomNumbers;
  
    return result;
  }

  function randomSoCCCD() {
    // Mảng chứa mã tỉnh/thành phố theo chuẩn CCCD
    const provinceCodes = [
      "001", "002", "004", "006", "008", "010", "011", "012", "014", "015", "017", "019", "020", "022", 
      "024", "025", "026", "027", "030", "031", "033", "034", "035", "036", "037", "038", "040", "042", 
      "044", "045", "046", "048", "049", "051", "052", "053", "054", "056", "058", "060", "062", "064", 
      "066", "067", "068", "070", "072", "074", "075", "076", "077", "078", "079", "080", "082", "084", 
      "086", "088", "089", "090", "091", "092", "093", "094", "095", "096", "097", "098"
    ];
  
    // Chọn mã tỉnh ngẫu nhiên từ danh sách
    const randomProvinceCode = provinceCodes[Math.floor(Math.random() * provinceCodes.length)];
  
    // Tạo 9 chữ số ngẫu nhiên còn lại
    let randomDigits = '';
    for (let i = 0; i < 9; i++) {
      randomDigits += Math.floor(Math.random() * 10);
    }
  
    // Ghép mã tỉnh và 9 chữ số ngẫu nhiên
    return randomProvinceCode + randomDigits;
  }
  

  async function randomPhongBanId() {
    try {
      // Truy vấn để lấy tất cả các _id từ các tài liệu trong PhongBanModel
      const ids = await PhongBanModel.find({}, '_id').exec();
      
      // Kiểm tra nếu không có tài liệu nào trong cơ sở dữ liệu
      if (ids.length === 0) {
        throw new Error('Không có dữ liệu trong PhongBanModel');
      }
  
      // Lấy ngẫu nhiên một _id từ danh sách ids
      const randomId = ids[Math.floor(Math.random() * ids.length)]._id;
  
      return randomId;
    } catch (error) {
      console.error('Lỗi khi lấy _id ngẫu nhiên:', error);
      throw error;
    }
  }

  function randomMoney(minSalary,maxSalary,donvi) {
    // Tạo số ngẫu nhiên trong khoảng từ 10000000 đến 50000000
    const randomNumber = Math.floor(Math.random() * (maxSalary - minSalary + 1)) + minSalary;
  
    // Làm tròn đến hàng nghìn
    return Math.round(randomNumber / donvi) * donvi;
  }

  function randomAttendanceStatus() {
    const randomValue = Math.random(); // Tạo số ngẫu nhiên từ 0 đến 1
    
    if (randomValue <= 0.85) {
      return 'co_mat'; // Chọn 'co_mat' với xác suất 85%
    } else {
      // Chọn ngẫu nhiên giữa 'nghi_co_phep' và 'nghi_khong_phep' nếu không phải 'co_mat'
      return Math.random() < 0.5 ? 'nghi_co_phep' : 'nghi_khong_phep';
    }
  }

  function randomOvertimeHours() {
    // Tạo một số ngẫu nhiên từ 0 đến 1
    const randomValue = Math.random();

    // Nếu số ngẫu nhiên nhỏ hơn hoặc bằng 0.85, trả về 0 (85% xác suất)
    if (randomValue <= 0.85) {
        return 0;
    }

    // Nếu số ngẫu nhiên lớn hơn 0.85, chọn một số từ 1 đến 4 (15% xác suất)
    return Math.floor(Math.random() * 4) + 1;
}
  
//========================================================================

  const generatePhongBanData = async (req, res) => {
    try {
        const phongBans = [];
  
        for (let i = 1; i <= 100; i++) {
          const tenPhongBan = `Phong Ban ${i}`;
          const ngayThanhLap = randomDateInCurrentYear();
      
          phongBans.push({
            ten_phong_ban: tenPhongBan,
            ngay_thanh_lap: ngayThanhLap
          });
        }
        await PhongBanModel.insertMany(phongBans);
      res.status(201).json({ message: 'Đã tựu động tạo thành công phòng ban' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const deleteAllDataPhongBan = async (req, res) => {
    try {
        await PhongBanModel.deleteMany({});
      res.status(201).json({ message: 'Đã xóa tất cả phòng ban thành công' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  function getDateListFromYearsAgo(yearsAgo) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 0 to only count the day
    const startDate = new Date();
    startDate.setFullYear(today.getFullYear() - yearsAgo);
  
    const dates = [];
    let currentDate = new Date(startDate);
  
    while (currentDate < today) {
      const dayOfWeek = currentDate.getDay();
      // Skip Saturday (6) and Sunday (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
  
    return dates;
  }
  
  function crateGioVaoGioRa(date,hour) {
    // Tạo đối tượng Date từ tham số date (nếu tham số không phải kiểu Date thì sẽ tạo mới)
    const inputDate = new Date(date);

    // Thiết lập 8 giờ sáng cho ngày đã truyền vào
    inputDate.setHours(hour, 0, 0, 0);

    // Chuyển thời gian sang UTC
    const utcTime = new Date(inputDate.toISOString());

    // Trả về thời gian UTC ở định dạng ISO 8601
    return utcTime.toISOString();
  }



  
  //nhân viên

  const generateNhanVienData = async (req, res) => {
    try {
        const nhanViens = [];
  
        for (let i = 1; i <= 2000; i++) {
          const {ten,gioiTinh } = randomVietnameseNameWithGender();
          const nam_sinh= randomBirthDate(1970,2001);
          const noi_sinh = randomLocationInVietnam();  
          const nguyen_quan = randomLocationInVietnam();
          const dia_chi_hien_tai = randomLocationInVietnam();
          const so_dien_thoai = randomPhoneNumber();
          const tinh_trang_hon_nhan = Math.random() > 0.5 ? "Có" : "Không";
          nhanViens.push({
            ten_nhan_su: ten,
            gioi_tinh: gioiTinh,
            nam_sinh: nam_sinh,
            noi_sinh: noi_sinh,
            nguyen_quan: nguyen_quan,   
            dia_chi_hien_tai: dia_chi_hien_tai,
            quoc_tich: 'Việt Nam',
            so_dien_thoai: so_dien_thoai,
            dan_toc: 'Kinh',
            ton_giao: "Không",
            trinh_do_van_hoa: '12/12',
            tinh_trang_hon_nhan: tinh_trang_hon_nhan,
          });
        }
        await NhanVienModel.insertMany(nhanViens);

        const nhanVienInfos = await NhanVienModel.find();
        await Promise.all(nhanVienInfos.map(async (nhanVienInfo) => {
          const ma_phong_ban = await randomPhongBanId();
          const ma_nhan_su = generateRandomCode();
          const chucVuCoQuan= {
            ma_phong_ban: ma_phong_ban,
            ma_nhan_su: ma_nhan_su,
            chuc_vu: "Nhân viên",
            thoi_gian_cong_hien: 0
          }

          const so_cccd = randomSoCCCD();
          const ngay_cap_cccd = randomDateInCurrentYear();
          const noi_cap_cccd = randomLocationInVietnam();
          const nhanVienCccd = {
            so_cccd: so_cccd,
            ngay_cap_cccd: ngay_cap_cccd,
            noi_cap_cccd: noi_cap_cccd,
          }
          const nhan_vien_id=nhanVienInfo._id;
          const chucVuCoQuanMoi=new ChucVuCoQuanModel({nhan_vien_id,...chucVuCoQuan});
          await chucVuCoQuanMoi.save();
          const nhanVienCccdMoi=new NhanVienCCCDModel({nhan_vien_id,...nhanVienCccd});
          await nhanVienCccdMoi.save();
        }));
      res.status(201).json({ message: 'Đã tự động tạo thành công nhân viên' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const deleteAllDataNhanVien = async (req, res) => {
    try {
        await NhanVienCCCDModel.deleteMany({});
        await ChucVuCoQuanModel.deleteMany({});
        await NhanVienModel.deleteMany({});
      res.status(201).json({ message: 'Đã xóa tất cả phòng ban thành công' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const generateLuongNhanVienData = async (req, res) => {
    try {
      const nhanVienIds = await ChucVuCoQuanModel.find({da_nghi_viec:false}).select('nhan_vien_id');
      const bangLuongs = [];
  
      nhanVienIds.map(async(nhanVienId) =>{
        const tien_luong = randomMoney(10000000,50000000,1000000);
        const khau_tru = randomMoney(1000000,2000000,1000);
        const phu_cap = randomMoney(1000000,3000000,1000);
        bangLuongs.push({
          nhan_vien_id: nhanVienId.nhan_vien_id,
          tien_luong: tien_luong,
          khau_tru: khau_tru,
          phu_cap: phu_cap,
          ngay_tra_luong: 12
        });
      } );
      await BangLuongModel.insertMany(bangLuongs);
    res.status(201).json({ message: 'Đã  tạo thành công lương cho mỗi nhân viên' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  }

  const deleteAllDataLuongNhanVien = async (req, res) => {
    try {
        await BangLuongModel.deleteMany({});
      res.status(201).json({ message: 'Đã xóa tất cả lương nhân viên thành công' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
//chấm công

const generateChamCongNhanVienData = async (req, res) => {
  try {
    const dirPath = './data';
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const nhanVienIds = await ChucVuCoQuanModel.find({ da_nghi_viec: false }).select('nhan_vien_id');
    const listDateInNYear = getDateListFromYearsAgo(10);
    const batchSize = 100000; // Kích thước mỗi file nhỏ

    let fileIndex = 1;
    let recordCount = 0;
    let chamCongsBatch = [];
    let filePath = `${dirPath}/data_part_${fileIndex}.json`;
    let writeStream = fs.createWriteStream(filePath, { flags: 'w', highWaterMark: 16 * 1024 });

    writeStream.write('[\n'); // Bắt đầu mảng JSON trong mỗi file

    for (const date of listDateInNYear) {
      for (const nhanVienId of nhanVienIds) {
        const ngay_cham_cong = date;
        const trang_thai = randomAttendanceStatus();
        const gio_vao = trang_thai === "co_mat" ? crateGioVaoGioRa(ngay_cham_cong, 8) : null;
        const gio_ra = trang_thai === "co_mat" ? crateGioVaoGioRa(ngay_cham_cong, 17) : null;
        const so_gio_lam_them = randomOvertimeHours();

        chamCongsBatch.push({
          nhan_vien_id: { "$oid": nhanVienId.nhan_vien_id },
          ngay_cham_cong: { "$date": ngay_cham_cong },
          trang_thai: trang_thai,
          gio_vao: gio_vao ? { "$date": gio_vao } : null,
          gio_ra: gio_ra ? { "$date": gio_ra } : null,
          so_gio_lam_them: so_gio_lam_them,
          so_gio_lam_viec: trang_thai === "co_mat" ? 8 : 0,
          createdAt:{ "$date": Date.now }
        });

        recordCount++;

        // Ghi vào file khi đạt kích thước batch hoặc hết dữ liệu
        if (chamCongsBatch.length >= batchSize) {
          const chunkData = chamCongsBatch.map(record => JSON.stringify(record)).join(',\n');
          writeStream.write(chunkData + '\n]\n');
          writeStream.end();

          console.log(`Đã ghi xong file ${filePath} với ${recordCount} bản ghi.`);

          // Nhập vào MongoDB và xóa file sau đó
          await importDataWithMongoImport({
            dbName: 'quan_ly_nhan_vien',
            collectionName: 'cham_congs',
            filePath
          });

          // Tạo file mới
          fileIndex++;
          filePath = `${dirPath}/data_part_${fileIndex}.json`;
          writeStream = fs.createWriteStream(filePath, { flags: 'w', highWaterMark: 16 * 1024 });
          writeStream.write('[\n');
          chamCongsBatch = [];
        }
      }
    }

    // Ghi những dữ liệu còn lại
    if (chamCongsBatch.length > 0) {
      const chunkData = chamCongsBatch.map(record => JSON.stringify(record)).join(',\n');
      writeStream.write(chunkData + '\n]\n');
      writeStream.end();

      console.log(`Đã ghi xong file ${filePath} với các bản ghi còn lại.`);

      // Nhập vào MongoDB và xóa file sau đó
      await importDataWithMongoImport({
        dbName: 'quan_ly_nhan_vien',
        collectionName: 'cham_congs',
        filePath
      });
    }

    res.status(201).json({ message: 'Đã tạo và nhập thành công các file JSON vào MongoDB' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Nhập dữ liệu bằng mongoimport và xóa file sau khi nhập thành công
function importDataWithMongoImport({ dbName, collectionName, filePath }) {
  return new Promise((resolve, reject) => {
    const mongoImport = spawn('mongoimport', [
      '--db', dbName,
      '--collection', collectionName,
      '--file', filePath,
      '--type', 'json',
      '--jsonArray'
    ]);

    mongoImport.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    mongoImport.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    mongoImport.on('close', (code) => {
      if (code === 0) {
        console.log(`File ${filePath} đã được nhập thành công!`);
        // Xóa file JSON sau khi nhập xong
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Không thể xóa file: ${err}`);
          } else {
            console.log(`Đã xóa file ${filePath} sau khi nhập thành công vào MongoDB`);
          }
        });
        resolve();
      } else {
        reject(new Error(`Quá trình mongoimport kết thúc với mã lỗi ${code}`));
      }
    });
  });
}



const deleteAllDataChamCongNhanVien = async (req, res) => {
  try {
      await ChamCongModel.deleteMany({});
    res.status(201).json({ message: 'Đã xóa tất cả lương nhân viên thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  module.exports = {
    generatePhongBanData,
    deleteAllDataPhongBan,
    generateNhanVienData,
    deleteAllDataNhanVien,
    generateLuongNhanVienData,
    deleteAllDataLuongNhanVien,
    generateChamCongNhanVienData,
    deleteAllDataChamCongNhanVien
};