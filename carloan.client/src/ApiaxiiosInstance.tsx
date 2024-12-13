import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: "https://localhost:7030/api/", 
  timeout: 10000, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized - Token might have expired.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
