import axios from "axios";
import { clearAuthSession, getAuthToken } from "../utils/authStorage";

const baseURL = (
  process.env.REACT_APP_BASE_API || ""
).replace(/\/$/, "");

const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

apiClient.interceptors.request.use((config) => {
  if (!baseURL) {
    return Promise.reject(new Error("Backend API URL is not configured"));
  }

  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthSession();
      unauthorizedHandler?.();
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "Unable to complete the request";

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
