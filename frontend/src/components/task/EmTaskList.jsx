import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import "react-calendar/dist/Calendar.css";
import "./task.css";

import ItTasksSection from "./TaskStatus/ItTasks";
import TargetList from "./TaskStatus/SalesTarget";
import SalesTable from "./TaskStatus/SalesTable";
import MarketTable from "./TaskStatus/MarketTable";
import MarketTargetList from "./TaskStatus/MarketTarget";
import OpTable from "./TaskStatus/OpTable";
import OpTargetList from "./TaskStatus/OpTarget";
import FinanceTargetList from "./TaskStatus/FInanceTargetlist";
import FinanceTable from "./TaskStatus/FinanceTable";

const EmTasklist = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [department, setDepartment] = useState(null);
    const [selectedSubDep, setSelectedSubDep] = useState("");
  const [subDepartments, setSubDepartments] = useState([]);
  const [userDesignation, setUserDesignation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Setup audio permission on first interaction
  useEffect(() => {
    const allowAudio = () => {
      localStorage.setItem("audioAllowed", "true");
      window.removeEventListener("click", allowAudio);
      window.removeEventListener("keydown", allowAudio);
      window.removeEventListener("touchstart", allowAudio);
    };

    window.addEventListener("click", allowAudio);
    window.addEventListener("keydown", allowAudio);
    window.addEventListener("touchstart", allowAudio);

    return () => {
      window.removeEventListener("click", allowAudio);
      window.removeEventListener("keydown", allowAudio);
      window.removeEventListener("touchstart", allowAudio);
    };
  }, []);

  // ✅ Fetch department & user data
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        const depRes = await fetch(
          `http://localhost:3000/api/department/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!depRes.ok) {
          throw new Error(
            `Department fetch failed with status ${depRes.status}`
          );
        }

        const depData = await depRes.json();

        if (depData.department) {
          setDepartment(depData.department);

          const rawSubs = depData.department.sub_departments || [];
          const mappedSubs = rawSubs.map((subName) => ({
            _id: subName,
            name: subName,
          }));
          setSubDepartments(mappedSubs);
        } else {
          setError("Department data not found.");
        }

        if (user?._id) {
          const empRes = await fetch(
            `http://localhost:3000/api/employee/user/${user._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!empRes.ok) {
            throw new Error(
              `Employee fetch failed with status ${empRes.status}`
            );
          }

          const empData = await empRes.json();
          const userEmp = empData.employees?.[0];
          setUserDesignation(userEmp?.designation || "");
        }
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, user]);

  return (
    <div
      className={`min-h-screen bg-gray-100 w-full ${
        department?.dep_name === "Sales" ||
        department?.dep_name === "Marketing" ||
        department?.dep_name === "Operations" ||
        department?.dep_name === "Finance"
          ? "p-0 m-0"
          : "px-4 py-8"
      }`}
    >
      <div className="w-[1000px] mx-auto">

        {loading && (
          <p className="text-center">Loading department details...</p>
        )}

        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && department && (
          <>
            {department.dep_name !== "Sales" &&
              department.dep_name !== "Marketing" &&
              department.dep_name !== "Operations" &&
              department.dep_name !== "Finance" && (
                <>
                  <div className="flex justify-center mb-6">

                    <div className="w-full mb-8">
                      <h2 className="w-full bg-red-300 rounded-xl shadow-xl p-5 text-center text-2xl font-bold text-gray-800">
                        {department.dep_name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 mb-4">
                    {subDepartments.length === 0 ? (
                      <p className="text-gray-500">No sub-departments found.</p>
                    ) : (
                      subDepartments.map((sub) => {
                        const isActive = userDesignation === sub.name;

                                  const isSelected = selectedSubDep === sub.name;

                        return (
                          <div
                            key={sub._id}
                             onClick={() => isActive && setSelectedSubDep(sub.name)}
              className={`w-36 px-4 py-3 text-center rounded-lg text-sm font-bold shadow-lg transition
                ${
                  isActive
                    ? "bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
                    : "bg-gray-200 text-gray-600 cursor-not-allowed"
                }
                ${isSelected ? "ring-2 ring-offset-2 ring-blue-300" : ""}
              `}
            >
              {sub.name}
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}

            <br />

            {/* ✅ Department specific components */}
            {department.dep_name === "IT" && (
              <ItTasksSection
                departmentId={id}
                userDesignation={userDesignation}
                userId={user?._id}
              />
            )}
            {department.dep_name === "Sales" && (
              <>
                <TargetList employeeName={user?.name} />
                <SalesTable />
              </>
            )}
            {department.dep_name === "Marketing" && (
              <>
                <MarketTargetList employeeName={user?.name} />
                <MarketTable />
              </>
            )}
            {department.dep_name === "Operations" && (
              <>
                <OpTargetList />
                <OpTable />
              </>
            )}
            {department.dep_name === "Finance" && (
              <>
                <FinanceTargetList />
                <FinanceTable />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmTasklist;
