import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { CareerProvider } from "./contexts/CareerContext";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <CareerProvider>
        <App />
      </CareerProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
