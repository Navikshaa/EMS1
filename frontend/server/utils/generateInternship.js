import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { fileURLToPath } from "url";
import QRCode from "qrcode";
import fetch from "node-fetch";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateRandomCode = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateInternship = async (name, dateRange, domain, imageUrl) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 Landscape

  // ✅ Background template
  const imagePath = path.resolve(
    __dirname,
    "../templates/internship_template.jpg"
  );
  if (fs.existsSync(imagePath)) {
    const imageBytes = fs.readFileSync(imagePath);
    const background = await pdfDoc.embedJpg(imageBytes);
    page.drawImage(background, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    });
  }

  // ✅ Profile image
  if (imageUrl) {
    try {
      const res = await fetch(imageUrl);
      const inputBuffer = Buffer.from(await res.arrayBuffer());

      const size = 120;
      const circleSvg = `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${
        size / 2
      }" /></svg>`;
      const roundedImageBuffer = await sharp(inputBuffer)
        .resize(size, size)
        .composite([{ input: Buffer.from(circleSvg), blend: "dest-in" }])
        .png()
        .toBuffer();

      const roundedImage = await pdfDoc.embedPng(roundedImageBuffer);
      page.drawImage(roundedImage, {
        x: 685,
        y: 311,
        width: 111,
        height: 115,
      });
    } catch (err) {
      console.warn("⚠️ Failed to load or process image:", err.message);
    }
  }

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const certificationId = generateRandomCode();
  const verifyUrl = `https://navikshaa.com/verify/${certificationId}`;
  const issuedOn = new Date().toISOString().split("T")[0]; // Only for DB

  // Name
  page.drawText(name, {
    x: 27,
    y: 390,
    size: 24,
    font,
    color: rgb(0, 0, 0),
  });

  // Domain
  page.drawText(`${domain}`, {
    x: 27,
    y: 310,
    size: 20,
    font,
    color: rgb(0, 0, 1),
  });

  // Date Range only
  page.drawText(dateRange, {
    x: 210,
    y: 195,
    size: 18,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Certification ID
  page.drawText(certificationId, {
    x: 120,
    y: 65,
    size: 13,
    font,
    color: rgb(0.6, 0.6, 0.7),
  });

  // Verification URL
  page.drawText(verifyUrl, {
    x: 10,
    y: 32,
    size: 12,
    font,
    color: rgb(0.4, 0.8, 1),
  });

  // ✅ QR Code with 10% border radius
  const qrDataUrl = await QRCode.toDataURL(verifyUrl);
  const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");

  const qrSize = 70;
  const radius = qrSize * 0.1;

  const roundedSvg = `
    <svg width="${qrSize}" height="${qrSize}">
      <rect x="0" y="0" width="${qrSize}" height="${qrSize}" rx="${radius}" ry="${radius}" />
    </svg>
  `;

  const roundedQrBuffer = await sharp(qrImageBytes)
    .resize(qrSize, qrSize)
    .composite([{ input: Buffer.from(roundedSvg), blend: "dest-in" }])
    .png()
    .toBuffer();

  const roundedQrImage = await pdfDoc.embedPng(roundedQrBuffer);
  page.drawImage(roundedQrImage, {
    x: 750,
    y: 8,
    width: qrSize,
    height: qrSize,
  });

  const pdfBytes = await pdfDoc.save();
  return { pdfBytes, certificationId, issuedOn }; 
};

export default generateInternship;
