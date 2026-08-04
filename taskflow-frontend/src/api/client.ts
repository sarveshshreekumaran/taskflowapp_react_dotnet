import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5214/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error);
        // Extract the raw server error string message safely from .NET response
        let cleanMessage = 'An unexpected system error occurred.';

        if (axios.isAxiosError(error) && error.response) {
            cleanMessage = typeof error.response.data === 'string' ? error.response.data : error.response.data?.message || cleanMessage
        }

        return Promise.reject(new Error(cleanMessage))
    }
)

export default apiClient;