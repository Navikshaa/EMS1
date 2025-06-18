import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx"; // ✅ Add this

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider> {/* ✅ Wrap here */}
        <App />
      </SocketProvider>
    </AuthProvider>
  </StrictMode> 
);
