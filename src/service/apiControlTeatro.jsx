import axios from 'axios';

export const apiControlTeatro = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    // headers: {
    //     'Access-Control-Allow-Origin': 'https://apicontrolteatro.onrender.com/api/',  // Or specific domain
    //     'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    //     'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    //     'Access-Control-Allow-Credentials': true
    //   }
});

