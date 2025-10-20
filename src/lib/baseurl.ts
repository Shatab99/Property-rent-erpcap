import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g., "/api/secure"
  headers: {
    "x-internal-key": process.env.NEXT_PUBLIC_INTERNAL_KEY!, // safe: only available on server
  },
});

export default api;