import { useState } from "react";
import { FaEye } from "react-icons/fa";
import DetailLeave from "../components/leave/DetailLeave";

export const getLeaveColumns = () => [
  { name: "Name", selector: (row) => row.name },
  { name: "Leave Type", selector: (row) => row.leaveType },
  { name: "Department", selector: (row) => row.department },
  { name: "Days", selector: (row) => row.days },
  { name: "Status", selector: (row) => row.status },
  { name: "Action", selector: (row) => row.action },
];

export const LeaveButtons = ({ Id }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        title="View"
        className="text-black p-1 hover:scale-110 transition-transform"
        onClick={() => setShowModal(true)}
      >
        <FaEye size={18} />
      </button>

      {showModal && <DetailLeave id={Id} onClose={() => setShowModal(false)} />}
    </>
  );
};
