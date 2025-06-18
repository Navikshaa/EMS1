import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

// ✅ Import assets
import Logo from "../assets/images/Logo.png";
import Illustration from "../assets/images/imagelog.png";
import TopRightShape from "../assets/images/Tpimg.png";
import BottomLeftShape from "../assets/images/Bottomimg.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const user = response.data.user;
        const token = response.data.token;

        localStorage.setItem("token", token);
        login(user);

        if (user.role === "admin") navigate("/admin-dashboard");
        else if (user.role === "hr") navigate("/hr-dashboard");
        else if (user.role === "employee") {
          if (user.firstLogin) navigate("/set-new-password");
          else navigate("/employee-dashboard");
        } else {
          setError("Unauthorized role. Please contact support.");
        }
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white overflow-hidden flex flex-col items-center">
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 py-6 px-4">
        <img src={Logo} alt="Logo" className="w-14 h-14 object-contain" />
        <h1 className="text-lg md:text-xl font-bold tracking-wide text-blue-950 text-center">
          Navikshaa Technologies LLP
        </h1>
      </div>

      {/* Background decorations */}
      <img
        src={BottomLeftShape}
        alt=""
        className="absolute top-[20px] right-[-40px] w-[200px] md:w-[300px] z-0"
      />
      <img
        src={TopRightShape}
        alt=""
        className="absolute bottom-[5px] left-[-20px] w-48 md:w-72 z-0"
      />

      {/* Login Card */}
      <div className="relative z-10 flex flex-col md:flex-row rounded-lg overflow-hidden w-[90%] md:w-4/5 lg:w-3/4 min-h-[520px] shadow-[0_0_60px_rgba(59,130,246,0.7)] bg-white">
        {/* Split Text "Welcome" */}
        <div className="absolute left-[50%] top-4 transform -translate-x-full text-blue-800 text-3xl md:text-4xl font-bold z-20">
          Welc
        </div>
        <div className="absolute left-[50%] top-4 text-white text-3xl md:text-4xl font-bold z-20">
          ome!
        </div>

        {/* Illustration */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6">
          <img
            src={Illustration}
            alt="Login Illustration"
            className="max-h-[300px] md:max-h-[400px] w-auto"
          />
        </div>

        {/* Login Form */}
        <div className="w-full md:w-1/2 bg-blue-800 text-white p-6 md:p-10 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-300 text-center">{error}</p>}

            <input
              type="email"
              placeholder="Username/Email Address"
              className="w-full px-4 py-2 rounded bg-white placeholder-blue-300 text-blue-800 focus:outline-none"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded bg-white placeholder-blue-300 text-blue-800 focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="text-right">
              <a href="#" className="text-sm text-white underline">
                Forget Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-blue-800 py-2 font-semibold rounded hover:bg-gray-100 transition"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 font-bold text-center text-gray-400 text-sm z-10 px-4 text-wrap">
        © Developed by Navikshaa Technologies LLP. All Rights Reserved
      </div>
    </div>
  );
};

export default Login;
