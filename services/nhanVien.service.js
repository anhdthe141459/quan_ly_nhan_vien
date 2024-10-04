const nhanVienModel = require('../models/nhanVien.model');

const getNhanViens = async() =>{
    return await nhanVienModel.find();
}

const createOrUpdateNhanVien = async(nhanVienMoi) =>{
    
    if(!nhanVienMoi.hasOwnProperty('_id')){
        const nhanVienUpdate=new nhanVienModel(nhanVienMoi);
        return await nhanVienUpdate.save();
    }else{
        let nhanVien=await nhanVienModel.findById(nhanVienMoi._id);
        Object.assign(nhanVien, nhanVienMoi);
        return await nhanVien.save();
    }
    
}
const removeNhanVien = async(id) =>{
    await nhanVienModel.findByIdAndDelete(id);
}

const searchNhanVien = async(query) =>{
    const nhanViens= await nhanVienModel.find(query);
    return nhanViens;
}

module.exports = {
    getNhanViens,
    createOrUpdateNhanVien,
    removeNhanVien,
    searchNhanVien,
};