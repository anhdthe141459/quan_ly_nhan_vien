const nhanVienModel = require('../models/nhanVien.model');

const getNhanViens = async() =>{
    try {
        const nhanViens= await nhanVienModel.find();
        console.log("nahnan========",nhanViens);
        return nhanViens
    } catch (error) {
        throw(error)
    }
}

module.exports = {
    getNhanViens
};