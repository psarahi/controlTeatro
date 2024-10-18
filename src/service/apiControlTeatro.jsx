import axios from 'axios';

export const apiControlTeatro = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

