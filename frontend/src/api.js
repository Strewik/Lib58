import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const isDevelopment  = import.meta.env.NODE === "development"
const api = axios.create({
    // baseURL: "http://localhost:8000"
    baseURL: isDevelopment ? import.meta.env.VITE_API_URL_LOCAL : import.meta.env.VITE_API_URL_DEPLOY

})

api.interceptors.request.use(
    (config) => {
        const token  = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api

