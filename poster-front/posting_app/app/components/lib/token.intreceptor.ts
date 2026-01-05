import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as any;
    
    if(error.response?.status === 401 && !originalRequest._retry

    ){
    originalRequest._retry = true;
    
     try {
      const refreshToken = localStorage.getItem('refreshToken')
      const response = await axios.post (`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,{refreshToken});
      const {token, refreshToken: newRefreshToken} = response.data

      localStorage.setItem('accessToken',token)
      localStorage.setItem('refreshToken',newRefreshToken)

      originalRequest.headers.Authorization = `Bearer ${token}`
      
      return api(originalRequest)

     }catch(refreshError) {
     localStorage.clear()
     window.location.href = '/login'
     return Promise.reject(refreshError)
     }
     
    }
    
    return Promise.reject(error)
  },
);

export default api;



