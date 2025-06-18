import React, { useState } from "react";
import axios from "axios";

const AddSalesForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    candidate_name: "",
    email: "",
    contact_no: "",
    whatsapp_no: "",
    date_of_joining: "",
    profile_type: "",
  });

  const handleOpen = () => {
    setIsOpen(true);
    setMessage("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessage("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/candidates", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("✅ Candidate added successfully!");
      setFormData({
        candidate_name: "",
        email: "",
        contact_no: "",
        whatsapp_no: "",
        date_of_joining: "",
        profile_type: "",
      });
      setTimeout(() => {
        handleClose();
      }, 800);
    } catch (error) {
      console.error("Error adding candidate:", error);
      setMessage("❌ Failed to add candidate.");
    }
  };
  

  return (
    <div className="p-2">
      <div className="flex justify-end mb-1">
        <button
          onClick={handleOpen}
          className="bg-black text-white text-lg px-4 py-2 rounded-full flex items-center gap-2"
        >
          <span className="text-xl font-bold">+</span> Add Candidate
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Candidate</h2>
              <button
                onClick={handleClose}
                className="text-red-500 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {message && (
              <p className="mb-4 text-center text-blue-600">{message}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {["candidate_name", "email", "contact_no", "whatsapp_no", "date_of_joining", "profile_type"].map(
                (field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {field.replace(/_/g, " ")}
                    </label>
                    <input
                      type={field === "date_of_joining" ? "date" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                      required
                    />
                  </div>
                )
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSalesForm;