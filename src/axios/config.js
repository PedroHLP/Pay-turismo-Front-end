import axios from "axios";
const BASE_URL = 'http://localhost:8080';
// const BASE_URL = 'http://sistemas.allinformatica.com.br:8080';

const automationFetch = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
export default automationFetch;


export const automationFetchPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        withCredentials: true,
    },
});


