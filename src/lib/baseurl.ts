import axios from "axios";
// const baseURL = "http://localhost:7008/api/v1"
const baseURL = "http://138.197.19.114:7008/api/v1"


const api = axios.create({
    baseURL: baseURL
});

export default api;
