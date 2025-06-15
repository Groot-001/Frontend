import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://backend-3-e5zd.onrender.com";

const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
    // sends cookies and authentication headers with every request made by the user
});
// creating an instance with the baseurl and the credenetials

axiosInstance.interceptors.response.use(
    res => res,
    async error => {
        const orireq = error.config;

        if (error.response?.status === 401 && !orireq._retry) {
            // if the status code in response = 401 then resends the refresh token 
            orireq._retry = true;
            try {
                await axios.post(
                    `${BACKEND_URL}/refresh-token`,
                    {},
                    { withCredentials: true }
                );
                return axiosInstance(orireq);
            } catch (error) {
                console.error("Token refresh failed", error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
