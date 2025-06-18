import PDFDocument from "pdfkit";
import fs from "fs";

const generateSalaryPDF = (salary, employee, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text("Salary Slip", { align: "center" }).moveDown();
    doc.fontSize(12).text(`Employee ID: ${employee.employeeId}`);
    doc.text(`Name: ${employee.name}`);
    doc.text(`Pay Date: ${new Date(salary.payDate).toDateString()}`);
    doc.text(`Gross Salary: ₹${salary.basicSalary}`);
    doc.moveDown();

    doc.fontSize(14).text("Allowances:");
    Object.entries(salary.breakdown.allowances).forEach(([k, v]) => {
      doc.text(`- ${k}: ₹${v.toFixed(2)}`);
    });

    doc.moveDown();
    doc.text("Deductions:");
    Object.entries(salary.breakdown.deductions).forEach(([k, v]) => {
      doc.text(`- ${k}: ₹${v.toFixed(2)}`);
    });

    doc.moveDown();
    doc.text(`Total Allowances: ₹${salary.allowances.toFixed(2)}`);
    doc.text(`Total Deductions: ₹${salary.deductions.toFixed(2)}`);
    doc.fontSize(14).text(`Net Salary: ₹${salary.netSalary.toFixed(2)}`, { underline: true });

    doc.end();

    stream.on("finish", () => resolve());
    stream.on("error", (err) => reject(err));
  });
};

export default generateSalaryPDF;
