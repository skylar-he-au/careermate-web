import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { setUnauthorizedHandler } from "./services/apiClient";
import store from "./store/store";
import { clearAuth } from "./store/authSlice";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));

setUnauthorizedHandler(() => {
  store.dispatch(clearAuth());
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
});

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
