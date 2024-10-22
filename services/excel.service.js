const xlsx = require('xlsx');

const downloadExcel = async(data) =>{
     // Create a new workbook
    const workbook = xlsx.utils.book_new();
    // Create a worksheet from the data
    const worksheet = xlsx.utils.aoa_to_sheet(data);

    // Add the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Write the workbook to a buffer
    const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    return excelBuffer;

}

module.exports = {
    downloadExcel, 
}
