import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

const saveAttendance = async (req, res) => {
  try {
    const { records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "No records to save." });
    }

    for (let record of records) {
      const existingRecord = await Attendance.findOne({
        userId: record.userId,
        date: record.date,
      });

      const statusToSave = record.status || "Present";

      if (!existingRecord) {
        // Create new record with status
        await Attendance.create({
          userId: record.userId,
          username: record.username,
          department: record.department,
          date: record.date,
          loginTime: record.loginTime,
          logoutTime: record.logoutTime,
          status: statusToSave,
        });
      } else {
        let updatedLogoutTime = existingRecord.logoutTime;
        if (
          record.logoutTime &&
          (!existingRecord.logoutTime ||
            new Date(record.logoutTime) > new Date(existingRecord.logoutTime))
        ) {
          updatedLogoutTime = record.logoutTime;
        }

        let updatedLoginTime = existingRecord.loginTime;
        if (
          record.loginTime &&
          (!existingRecord.loginTime ||
            new Date(record.loginTime) < new Date(existingRecord.loginTime))
        ) {
          updatedLoginTime = record.loginTime;
        }

        //  here logic
        let updatedStatus = existingRecord.status;
        if (record.status && record.status !== existingRecord.status) {
          updatedStatus = record.status;
        }

        await Attendance.updateOne(
          { userId: record.userId, date: record.date },
          {
            $set: {
              loginTime: updatedLoginTime,
              logoutTime: updatedLogoutTime,
              status: updatedStatus,
            },
          }
        );
      }
    }

    res.status(200).json({ message: "Attendance data saved successfully." });
    // console.log("Records received:", JSON.stringify(records, null, 2));
  } catch (err) {
    console.error("Error saving attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const viewAttendance = async (req, res) => {
  try {
    const users = await Attendance.aggregate([
      {
        $group: {
          _id: "$userId",
          department: { $first: "$department" },
          username: { $first: "$username" },
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "userId",
          as: "employeeDetails",
        },
      },
      {
        $unwind: {
          path: "$employeeDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          userId: "$_id",
          employeeId: "$employeeDetails.employeeId",
          name: { $ifNull: ["$employeeDetails.name", "$username"] },
          department: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(users);
  } catch (err) {
    console.error("Error retrieving attendance users:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const viewAttendanceByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // 1. Fetch employee details
    const employee = await Employee.findOne({ userId }).select(
      "name department employeeId userId"
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // 2. Fetch attendance records for user
    const attendanceRecords = await Attendance.find({ userId })
      .sort({ date: -1 })
      .select(
        "date loginTime logoutTime status department username employeeId userId"
      );

    // 3. Build response in the format like viewAttendance
    res.status(200).json({
      userId: employee.userId,
      employeeId: employee.employeeId,
      name: employee.name,
      department: employee.department,
      attendance: attendanceRecords,
    });
  } catch (err) {
    console.error("Error retrieving attendance for user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const editAttendanceTime = async (req, res) => {
  try {
    const { userId, date, loginTime, logoutTime } = req.body;

    if (!userId || !date) {
      return res.status(400).json({ message: "userId and date are required." });
    }

    // Find the attendance record for the user on the specific date
    const attendanceRecord = await Attendance.findOne({ userId, date });

    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found." });
    }

    // Update the loginTime and logoutTime if provided
    if (loginTime) attendanceRecord.loginTime = loginTime;
    if (logoutTime) attendanceRecord.logoutTime = logoutTime;

    await attendanceRecord.save();

    res.status(200).json({
      message: "Attendance times updated successfully.",
      attendance: attendanceRecord,
    });
  } catch (err) {
    console.error("Error updating attendance times:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateAttendanceByDate = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date, loginTime, logoutTime, status } = req.body;

    if (!userId || !date) {
      return res.status(400).json({ message: "userId and date are required." });
    }

    const attendance = await Attendance.findOne({ userId, date });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found." });
    }

    if (loginTime !== undefined) attendance.loginTime = loginTime;
    if (logoutTime !== undefined) attendance.logoutTime = logoutTime;
    if (status !== undefined) attendance.status = status;

    await attendance.save();

    res.status(200).json({
      message: "Attendance updated successfully.",
      attendance,
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAttendanceStatsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const records = await Attendance.find({ userId });

    let stats = {
      presence: 0,
      lop: 0,
      lateLogin: 0,
      halfDay: 0,
      casualLeave: 0,
      earnedLeave: 0,
      sickLeave: 0,
    };

    const LATE_THRESHOLD = "10:00"; // 10:00 AM

    for (const rec of records) {
      if (rec.status === "Present") stats.presence += 1;
      if (rec.status === "LOP") stats.lop += 1;
      if (rec.status === "Half Day") stats.halfDay += 1;

      // Late login logic
      if (
        rec.loginTime &&
        rec.status === "Present" &&
        rec.loginTime > LATE_THRESHOLD
      ) {
        stats.lateLogin += 1;
      }

      // Optional leave types
      if (rec.status === "Casual Leave") stats.casualLeave += 1;
      if (rec.status === "Earned Leave") stats.earnedLeave += 1;
      if (rec.status === "Sick Leave") stats.sickLeave += 1;
    }

    return res.status(200).json({ success: true, stats });
  } catch (err) {
    console.error("Error fetching attendance stats:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const viewAttendanceByDepartmentId = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const employees = await Employee.find({ department: departmentId });

    if (!employees || employees.length === 0) {
      return res
        .status(404)
        .json({ message: "No employees found in department" });
    }

    const userIds = employees.map((emp) => emp.userId);

    const attendanceRecords = await Attendance.find({
      userId: { $in: userIds },
    });

    const attendanceMap = {};

    for (const emp of employees) {
      attendanceMap[emp.userId] = {
        userId: emp.userId,
        employeeId: emp.employeeId,
        name: emp.name,
        department: emp.department,
        attendance: [],
      };
    }

    for (const record of attendanceRecords) {
      if (attendanceMap[record.userId]) {
        attendanceMap[record.userId].attendance.push({
          date: record.date,
          loginTime: record.loginTime,
          logoutTime: record.logoutTime,
          status: record.status,
        });
      }
    }

    const result = Object.values(attendanceMap);

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("Error fetching department attendance:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  saveAttendance,
  viewAttendance,
  editAttendanceTime,
  viewAttendanceByUserId,
  updateAttendanceByDate,
  getAttendanceStatsByUserId,
  viewAttendanceByDepartmentId,
};
