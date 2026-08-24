import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_POKEMON_API,
    timeout:10000,
    headers:{
        'Content-Type': 'application/json',
    }
});

export default api;
