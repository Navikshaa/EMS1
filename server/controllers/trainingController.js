import generateTraining from "../utils/generateTraining.js";
import fetch from "node-fetch";

const getCertificate = async (req, res) => {
  try {
    const userId = req.params.id;

    // ✅ CORS headers
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Expose-Headers", "x-certificate-id");

    // Fetch tasks
    const response = await fetch("http://localhost:3000/api/salestask");
    const data = await response.json();
    const tasks = data.salestasks || data;
    const user = tasks.find((item) => item._id === userId);

    if (!user) {
      return res.status(404).send("Sales task user not found");
    }

    const name = user.customer_name;
    const domain = user.domain_interested;
    const completionDate = new Date().toISOString().split("T")[0];

    // Generate cert
    const { pdfBytes, certificationId, issuedOn } = await generateTraining(
      name,
      completionDate,
      domain
    );

    // Save to DB
    await fetch(`http://localhost:3000/api/salestask/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        training_certificate_id: certificationId,
        certificate_issued_on: issuedOn,
      }),
    });

    // ✅ Set all final headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${name}_certificate.pdf`
    );
    res.setHeader("x-certificate-id", certificationId); // ✅ Send certificate ID

    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("❌ Error generating certificate:", error);
    res.status(500).send("Error generating certificate");
  }
};

export default getCertificate;
