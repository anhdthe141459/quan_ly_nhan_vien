const nhanVienService = require('../services/nhanVien.service');

const getNhanViens = async (req, res) => {
    try {
      const nhanViens = await nhanVienService.getNhanViens();
      res.json(nhanViens);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
    getNhanViens,
};