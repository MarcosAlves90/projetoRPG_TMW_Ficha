import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "@popperjs/core/dist/umd/popper.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./UserContext.jsx";
import { ToastProvider } from "@/assets/components/design-system/ToastProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
