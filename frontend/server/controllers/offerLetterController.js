import fetch from "node-fetch";
import  generateOfferLetter  from "../utils/generateOfferletter.js";


export const getOfferLetter = async (req, res) => {
  try {
    const userId = req.params.id;

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Fetch data
    const response = await fetch("http://localhost:3000/api/salestask");
    const data = await response.json();
    const tasks = data.salestasks || data;
    const user = tasks.find((item) => item._id === userId);
    if (!user) return res.status(404).send("User not found");

    const {
      customer_name,
      domain_interested,
      internship_start_date,
      internship_end_date,
    } = user;

    if (!internship_start_date || !internship_end_date) {
      return res.status(400).send("Internship dates missing");
    }

    // 🔹 Generate PDF and ID from utility
    const { pdfBytes, offerLetterId } = await generateOfferLetter(
      customer_name,
      domain_interested,
      internship_start_date,
      internship_end_date
    );

    // 🔹 Save offer_letter_id to DB
    await fetch(`http://localhost:3000/api/salestask/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ offer_letter_id: offerLetterId }),
    });

    // 🔹 Send PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${customer_name}_offer_letter.pdf`
    );
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Error generating offer letter:", error);
    res.status(500).send("Error generating offer letter");
  }
};
