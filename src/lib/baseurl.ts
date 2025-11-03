import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
});


api.interceptors.request.use(
  async (config) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token`);
      const data = await response.json();
      if (data.data) {
        config.headers["x-internal-key"] = data.data;
      }
    } catch (error) {
      console.error('Error fetching token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;