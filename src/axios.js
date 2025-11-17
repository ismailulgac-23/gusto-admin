import service from "axios";

export const SERVER_URL = "https://api.gustoapp.net";
// export const SERVER_URL = "http://95.217.214.161:3000";
export const API_URL = `${SERVER_URL}/api`;

const axios = service.create({
    baseURL: API_URL,
});

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Backend hem Authorization hem de token header'ını kabul ediyor
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['token'] = token; // Backward compatibility
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - 401 durumunda logout
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            if (typeof window !== 'undefined' && window.location.pathname !== '/signin') {
                window.location.href = '/signin';
            }
        }
        return Promise.reject(error);
    }
);

export default axios;