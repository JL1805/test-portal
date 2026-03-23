import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as typeof error.config & { _retryCount?: number };
    if (!config || config._retryCount === undefined) {
      config._retryCount = 0;
    }

    const isRetryable =
      !error.response ||
      error.code === 'ECONNABORTED' ||
      (error.response.status >= 500 && error.response.status < 600);

    if (isRetryable && config._retryCount < 3) {
      config._retryCount += 1;
      const delay = Math.pow(2, config._retryCount - 1) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return axiosInstance(config);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
