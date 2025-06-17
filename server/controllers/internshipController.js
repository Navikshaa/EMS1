import generateInternship from "../utils/generateInternship.js";
import fetch from "node-fetch";

const getInternshipCertificate = async (req, res) => {
  try {
    const userId = req.params.id;

    // Allow CORS for frontend
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Fetch internship user from salestask collection
    const response = await fetch("http://localhost:3000/api/salestask");
    const data = await response.json();
    const internships = data.internships || data;

    const user = internships.find((item) => item._id === userId);

    if (!user) {
      return res.status(404).send("Internship user not found");
    }

    const name = user.customer_name;
    const domain = user.domain_interested;
    const imageUrl = user.upload_image;

    // Format internship duration
    const start = new Date(user.internship_start_date);
    const end = new Date(user.internship_end_date);
    const isValidStart = !isNaN(start.getTime());
    const isValidEnd = !isNaN(end.getTime());

    const startMonth = isValidStart
      ? start.toLocaleString("en-US", { month: "long" })
      : "Invalid";
    const endMonth = isValidEnd
      ? end.toLocaleString("en-US", { month: "long" })
      : "Invalid";

    const dateRange = `${startMonth} - ${endMonth}`;

    // Generate certificate PDF
    const { pdfBytes, certificationId, issuedOn } = await generateInternship(
      name,
      dateRange,
      domain,
      imageUrl
    );

    // Update user data with certificate details
    await fetch(`http://localhost:3000/api/salestask/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        internship_certificate_id: certificationId,
        internship_issued_on: issuedOn,
        internship_date_range: dateRange,
      }),
    });

    // Send PDF with certification ID in response header
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${name}_internship_certificate.pdf`
    );
    res.setHeader("x-certificate-id", certificationId); // ✅ Added header for frontend popup

    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("❌ Internship certificate generation error:", error);
    res.status(500).send("Error generating internship certificate");
  }
};

export default getInternshipCertificate;
