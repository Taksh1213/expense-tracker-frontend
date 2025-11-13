import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ backend base URL
  withCredentials: true, // ✅ needed for refresh token cookies
});

export default api;
