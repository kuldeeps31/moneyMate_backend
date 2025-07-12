const ExcelJS = require("exceljs");


exports.generateCustomerExport = async (data, res, filename) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Customer Data");

  sheet.columns = [
  { header: "नाम", key: "name", width: 20 },
  { header: "फ़ोन", key: "phone", width: 15 },
  { header: "पता", key: "address", width: 25 },
  { header: "भुगतान दिनांक", key: "paymentDate", width: 15 },
  { header: "आज का भुगतान", key: "paidAmount", width: 15 },
  { header: "बकाया", key: "remainingAmount", width: 15 },
  { header: "कुल राशि", key: "totalAmount", width: 15 },
  { header: "आइटम्स", key: "items", width: 50 },
];

  data.forEach((row) => sheet.addRow(row));

  const buffer = await workbook.xlsx.writeBuffer();

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  res.send(buffer);
};
