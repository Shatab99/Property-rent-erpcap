import axios from "axios";
const baseURL = "http://localhost:7008/api/v1"


const api = axios.create({
    baseURL: baseURL
});

export default api;
