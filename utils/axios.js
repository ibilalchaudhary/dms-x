import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://dmsglobal.net/ct-api',
});

apiClient.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer 8U7dPDoiozxF26WNLAdJdo2S9KN7wwg58Dub0v9D`;
    return config;
});

export default apiClient;