import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const PfView = () => {
  const { user } = useAuth();
  const [pfData, setPfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchPfData = async () => {
    try {
      if (!user) return;

      const pfRes = await axios.get(
        `http://localhost:3000/api/pf/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPfData(pfRes.data);
    } catch (error) {
      console.error("Error fetching PF data:", error.message);
      setPfData(null); // In case of 404
    } finally {
      setLoading(false);
    }
  };

  const handleGetThisMonthPf = async () => {
    try {
      setButtonLoading(true);
      setMessage("");

      const res = await axios.post(
        `http://localhost:3000/api/pf`,
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPfData(res.data);
      setMessage("PF for this month fetched/updated successfully.");
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to update PF.";
      setMessage(errMsg);
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    fetchPfData();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Provident Fund Details</h2>

      <button
        onClick={handleGetThisMonthPf}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={buttonLoading}
      >
        {buttonLoading ? "Processing..." : "Get This Month PF"}
      </button>

      {message && (
        <div className="mb-4 text-green-600 font-semibold">{message}</div>
      )}

      {pfData ? (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <tbody>
            <tr className="border-b">
              <td className="p-4 font-semibold">Initial PF:</td>
              <td className="p-4">₹{pfData.initialPf}</td>
            </tr>
            <tr className="border-b">
              <td className="p-4 font-semibold">Last Updated PF:</td>
              <td className="p-4">₹{pfData.lastUpdatedPf}</td>
            </tr>
            <tr className="border-b">
              <td className="p-4 font-semibold">Paid Amount:</td>
              <td className="p-4">₹{pfData.paidAmount}</td>
            </tr>
            <tr className="border-b">
              <td className="p-4 font-semibold">Current Updated PF:</td>
              <td className="p-4">₹{pfData.currentUpdatedPf}</td>
            </tr>
            <tr className="border-b">
              <td className="p-4 font-semibold">Company Contribution:</td>
              <td className="p-4">₹{pfData.interestCompany}</td>
            </tr>
            <tr className="border-b">
              <td className="p-4 font-semibold">Government Contribution:</td>
              <td className="p-4">₹{pfData.interestGovernment}</td>
            </tr>
            <tr className="bg-gray-100 font-bold">
              <td className="p-4">Total PF:</td>
              <td className="p-4">₹{pfData.total}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div>No PF data found. Click the button above to generate it.</div>
      )}
    </div>
  );
};

export default PfView;
