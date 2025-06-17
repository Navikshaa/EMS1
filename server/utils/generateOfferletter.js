// generateOfferletter.js
import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Helper to generate random code here
const generateRandomCode = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateOfferLetter = async (name, domain, startDate, endDate) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([1191, 842]);

  // Embed template
  const templatePath = path.resolve(
    __dirname,
    "../templates/offer_letter_template.jpg"
  );
  if (fs.existsSync(templatePath)) {
    const templateBytes = fs.readFileSync(templatePath);
    const templateImage = await pdfDoc.embedJpg(templateBytes);
    page.drawImage(templateImage, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    });
  }

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const formattedStart = new Date(startDate).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
  const formattedEnd = new Date(endDate).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  const durationMs = new Date(endDate) - new Date(startDate);
  const durationDays = Math.round(durationMs / (1000 * 60 * 60 * 24)) + 1;

  page.drawText(` ${name}`, {
    x: 90,
    y: 712,
    size: 14,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  page.drawText(` ${name}`, {
    x: 45,
    y: 137,
    size: 14,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  page.drawText(` ${domain}`, {
    x: 535,
    y: 645,
    size: 14,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  page.drawText(` ${domain} Intern`, {
    x: 235,
    y: 567,
    size: 14,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  page.drawText(` ${formattedStart}`, {
    x: 200,
    y: 531,
    size: 14,
    font: fontRegular,
    color: rgb(0.1, 0.1, 0.1),
  });
  page.drawText(` ${formattedEnd}`, {
    x: 195,
    y: 516,
    size: 14,
    font: fontRegular,
    color: rgb(0.1, 0.1, 0.1),
  });
  page.drawText(`${durationDays} day${durationDays > 1 ? "s" : ""}`, {
    x: 195,
    y: 500,
    size: 14,
    font: fontRegular,
    color: rgb(0.1, 0.1, 0.1),
  });

  const pdfBytes = await pdfDoc.save();

  const offerLetterId = generateRandomCode();

  return { pdfBytes, offerLetterId };
};

export default generateOfferLetter;
