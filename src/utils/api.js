import axios from "axios";

const api = axios.create({
  baseURL: "https://expense-tracker-backend-vsxb.onrender.com",
  withCredentials: true,
});

export default api;
