import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { fileURLToPath } from "url";
import QRCode from "qrcode";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Helper to generate 10-character alphanumeric ID
const generateRandomCode = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateTraining = async (name, date, domain) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 Landscape

  // ✅ Template image path
  const imagePath = path.resolve(
    __dirname,
    "../templates/training_template.jpg"
  );

  if (!fs.existsSync(imagePath)) {
    throw new Error(`Template image not found at ${imagePath}`);
  }

  const imageBytes = fs.readFileSync(imagePath);
  const jpgImage = await pdfDoc.embedJpg(imageBytes);

  page.drawImage(jpgImage, {
    x: 0,
    y: 0,
    width: page.getWidth(),
    height: page.getHeight(),
  });

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Format date as "June 06, 2025"
  const issuedOn = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  // 🔹 Generate random Certification ID
  const certificationId = generateRandomCode();
  const verifyUrl = `https://localhost:5173/verify/${certificationId}`;

  // Draw name
  page.drawText(name, {
    x: 27,
    y: 390,
    size: 24,
    font,
    color: rgb(0, 0, 0),
  });

  // Draw domain
  page.drawText(`${domain}`, {
    x: 27,
    y: 310,
    size: 20,
    font,
    color: rgb(0, 0, 1),
  });

  // Draw issued label
  page.drawText("Certificate Issued on:", {
    x: 27,
    y: 195,
    size: 16,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Draw actual date
  page.drawText(issuedOn, {
    x: 220,
    y: 195,
    size: 16,
    font,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Draw Certification ID
  page.drawText(`${certificationId}`, {
    x: 120,
    y: 65,
    size: 13,
    font,
    color: rgb(0.6, 0.6, 0.7),
  });

  // Draw Verification URL
  page.drawText(verifyUrl, {
    x: 10,
    y: 32,
    size: 12,
    font,
    color: rgb(0.4, 0.8, 1),
  });

  // ✅ Generate QR Code from verification URL
  const qrDataUrl = await QRCode.toDataURL(verifyUrl);
  const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const qrImage = await pdfDoc.embedPng(qrImageBytes);

  // 🖼️ Draw QR Code
  page.drawImage(qrImage, {
    x: 750,
    y: 8,
    width: 70,
    height: 68,
  });

  const pdfBytes = await pdfDoc.save();
  return { pdfBytes, certificationId, issuedOn };
};

export default generateTraining;
