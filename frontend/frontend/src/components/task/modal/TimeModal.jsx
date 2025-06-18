import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./TimeModal.css";
import { Clock3 } from "lucide-react"; // Icon matching image

const TimeModal = ({
  isOpen,
  onClose,
  task,
  timeReason,
  setTimeReason,
  onSubmit,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isOpen && !initialized) {
      if (task?.startDate && task?.endDate) {
        setSelectedDate([new Date(task.startDate), new Date(task.endDate)]);
      } else if (task?.startDate) {
        setSelectedDate(new Date(task.startDate));
      } else {
        setSelectedDate(null);
      }
      setInitialized(true);
    }
    if (!isOpen) {
      setInitialized(false);
    }
  }, [isOpen, task, initialized]);

  if (!isOpen) return null;

  const [start, end] = Array.isArray(selectedDate)
    ? selectedDate
    : [selectedDate, null];

  const isSameDay = (d1, d2) =>
    d1 && d2 && d1.toDateString() === d2.toDateString();

  const isInRange = (date, rangeStart, rangeEnd) =>
    rangeStart && rangeEnd && date >= rangeStart && date <= rangeEnd;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 relative w-[900px] max-w-full flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg font-bold"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Left Calendar Section */}
        <div className="flex-1">
          <div className="flex items-center mb-3 space-x-2">
            <Clock3 className="w-6 h-6 text-black" />
            <h2 className="text-lg font-bold text-black">Delay</h2>
          </div>
          <p className="text-lg font-medium bold mb-2 text-black">Submit By:</p>
          <Calendar
            selectRange={true}
            onChange={setSelectedDate}
            value={selectedDate}
            className="border rounded-md"
            tileClassName={({ date, view }) => {
              if (view !== "month") return null;

              const taskStart = task?.startDate
                ? new Date(task.startDate)
                : null;
              const taskEnd = task?.endDate ? new Date(task.endDate) : null;

              if (
                taskStart &&
                (isSameDay(date, taskStart) ||
                  (taskEnd && isSameDay(date, taskEnd)))
              ) {
                return "highlight-task-fixed";
              }

              if (
                Array.isArray(selectedDate) &&
                isInRange(date, selectedDate[0], selectedDate[1])
              ) {
                return "highlight-range";
              }

              return null;
            }}
          />
        </div>

        {/* Right Reason Section */}
        <div className="flex-1 flex flex-col items-end justify-between pl-6">
          <label className="text-lg font-semibold text-black w-full mb-1">
            Reason:
          </label>
          <textarea
            rows={10}
            maxLength={1000}
            className="w-full rounded-xl border border-gray-300 p-3 resize-none bg-gray-100 placeholder-gray-500 text-sm"
            placeholder="Enter your Reason"
            value={timeReason}
            onChange={(e) => setTimeReason(e.target.value)}
          />
          <button
            className="mt-4 px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
            onClick={() => onSubmit(selectedDate)}
          >
            Request for Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeModal;
