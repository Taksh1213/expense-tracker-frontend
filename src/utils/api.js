import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://expense-tracker-backend-vsxb.onrender.com/api"
      : "http://localhost:5000/api",  // local development
  withCredentials: true, // needed for refresh-token cookies
});

export default api;
