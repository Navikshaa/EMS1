import React from "react";
import EmProfile from "./EmProfile";
import AttendanceCalendar from "./UserAttendance";
import { useParams } from "react-router-dom";

const EmpAttendancePage = () => {
  const { userId } = useParams();

  return (
    <div className="p-4">
      {/* Employee Profile */}
      <EmProfile userId={userId} />

      <div className="my-6 border-b border-gray-300" />

      {/* Attendance Calendar */}
      <AttendanceCalendar userId={userId} />
    </div>
  );
};

export default EmpAttendancePage;
