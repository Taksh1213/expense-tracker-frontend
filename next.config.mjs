import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  distDir: ".next",
  images: {
    domains: ["expense-tracker-backend-vsxb.onrender.com", "localhost"],
  },
};

export default nextConfig;
