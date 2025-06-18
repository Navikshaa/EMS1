import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/authContext";

const programTypes = ["Autonomous Learning", "Mentor Sync", "Accelerator"];

const AddSalesForm = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [marketingSources, setMarketingSources] = useState([]);

  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    college_email: "",
    contact_no: "",
    whatsapp_no: "",
    domain_interested: "",
    ticket_size: "",
    registration_amount: "",
    pending_amount: "",
    pending_date: "",
    program_type: "",
    internship_start_date: "",
    internship_end_date: "",
    marketed_from: "",
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3000/api/employee/user/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const emp = res.data.employees?.[0];
        if (emp && emp.name) setEmployeeName(emp.name);
      } catch (err) {
        console.error("Error fetching employee info:", err);
      }
    };

    const fetchMarketingSources = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/employee/designation-name/Marketing"
        );
        const employees = res.data || [];
        setMarketingSources(employees.map((emp) => emp.name));
      } catch (err) {
        console.error("Error fetching marketing sources:", err);
      }
    };

    if (user?._id) {
      fetchEmployee();
    }
    fetchMarketingSources();
  }, [user]);

  const handleOpen = () => {
    setIsOpen(true);
    setMessage("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, name: employeeName };
      await axios.post(
        "http://localhost:3000/api/salestask/add",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
        payload
      );
      setMessage("✅ Customer details added successfully!");
      setFormData({
        customer_name: "",
        email: "",
        college_email: "",
        contact_no: "",
        whatsapp_no: "",
        domain_interested: "",
        ticket_size: "",
        registration_amount: "",
        pending_amount: "",
        pending_date: "",
        program_type: "",
        internship_start_date: "",
        internship_end_date: "",
        marketed_from: "",
      });

      setTimeout(() => {
        handleClose();
      }, 800);
    } catch (error) {
      console.error("Error adding customer:", error);
      setMessage("❌ Failed to add customer details.");
    }
  };

  return (
    <div className="p-2">
      <div className="flex justify-end mb-1">
        <button
          onClick={handleOpen}
          className="bg-black text-white text-lg px-1 py-2 rounded-full flex items-center gap-2"
        >
          <span className="text-xl font-bold">+</span> Add Customer
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Customer</h2>
              <button
                onClick={handleClose}
                className="ml-auto text-red-500 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {message && (
              <p className="mb-4 text-center text-blue-600">{message}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                ["customer_name", "Customer Name"],
                ["email", "Email"],
                ["college_email", "College Email"],
                ["contact_no", "Contact No"],
                ["whatsapp_no", "WhatsApp No"],
                ["domain_interested", "Domain Interested"],
                ["ticket_size", "Ticket Size", "number"],
                ["registration_amount", "Registration Amount", "number"],
                ["pending_amount", "Pending Amount", "number"],
              ].map(([name, label, type = "text"]) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                    required={[
                      "customer_name",
                      "email",
                      "college_email",
                      "contact_no",
                      "ticket_size",
                      "registration_amount",
                      "pending_amount",
                    ].includes(name)}
                  />
                </div>
              ))}

              {/* Program Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Program Type
                </label>
                <select
                  name="program_type"
                  value={formData.program_type}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                >
                  <option value="">Select Program Type</option>
                  {programTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Fields */}
              {[
                ["pending_date", "Pending Date", "date"],
                ["internship_start_date", "Internship Start Date", "date"],
                ["internship_end_date", "Internship End Date", "date"],
              ].map(([name, label, type = "text"]) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>
              ))}

              {/* Marketed From Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Marketed From
                </label>
                <select
                  name="marketed_from"
                  value={formData.marketed_from}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                >
                  <option value="">Select Source</option>
                  {marketingSources.map((name, idx) => (
                    <option key={idx} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSalesForm;
