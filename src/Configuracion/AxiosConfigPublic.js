// apiPublic.js
import axios from "axios";

const BASE_URL = "/api"; 

const apiPublic = axios.create({
  baseURL: BASE_URL,
    withCredentials: true,
});

export default apiPublic;
