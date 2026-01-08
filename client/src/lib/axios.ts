import axios from 'axios';

// Detect if running on mobile (not localhost)
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Your Mac's local IP address
const LOCAL_IP = '192.168.21.107';

// Use localhost for desktop browser, local IP for mobile
const baseURL = import.meta.env.VITE_API_URL || (isLocalhost
    ? 'http://localhost:3000'           // Desktop browser
    : `http://${LOCAL_IP}:3000`);       // Mobile phone

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

console.log('API Base URL:', baseURL);
console.log('Is Localhost:', isLocalhost);
console.log('Current hostname:', window.location.hostname);
