import Pf from "../models/Pf.js";
import Employee from "../models/Employee.js";
import moment from "moment";

// POST /api/pf
export const createOrUpdatePf = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    // Fetch employee details from Employee model
    const employee = await Employee.findOne({ userId }).lean();

    if (!employee || !employee.salary) {
      return res.status(404).json({
        message: "Employee not found or basicSalary missing.",
      });
    }

    const grossPay = Math.floor(employee.salary / 12);
    const paidAmount = grossPay * 0.1;

    let pfRecord = await Pf.findOne({ userId });

    const currentMonth = moment().format("YYYY-MM");

    if (pfRecord && pfRecord.lastUpdatedMonth === currentMonth) {
      return res
        .status(200)
        .json({ message: "PF already updated for this month." });
    }

    const initialPf = pfRecord?.initialPf ?? 1500;
    const lastUpdatedPf = pfRecord?.currentUpdatedPf ?? 0;
    const currentUpdatedPf = lastUpdatedPf + paidAmount;

    const interestCompany = (3.25 / 100) * paidAmount;
    const interestGovernment = (7.2 / 100) * paidAmount;
    const total =
      initialPf + currentUpdatedPf + interestCompany + interestGovernment;

    if (pfRecord) {
      // Update existing record
      pfRecord.lastUpdatedPf = lastUpdatedPf;
      pfRecord.paidAmount = paidAmount;
      pfRecord.currentUpdatedPf = currentUpdatedPf;
      pfRecord.interestCompany = interestCompany;
      pfRecord.interestGovernment = interestGovernment;
      pfRecord.total = total;
      pfRecord.lastUpdatedMonth = currentMonth;

      await pfRecord.save();
      return res.status(200).json(pfRecord);
    }

    // Create new PF record
    const newPf = new Pf({
      userId,
      initialPf,
      lastUpdatedPf: 0,
      paidAmount,
      currentUpdatedPf,
      interestCompany,
      interestGovernment,
      total,
      lastUpdatedMonth: currentMonth,
    });

    await newPf.save();
    res.status(201).json(newPf);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/pf/:userId
export const getPfByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const pf = await Pf.findOne({ userId });

    if (!pf) {
      return res.status(404).json({ message: "PF data not found." });
    }

    res.status(200).json(pf);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
