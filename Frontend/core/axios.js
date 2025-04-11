import axios from 'axios';
import { getAuthHeader } from './auth';

const api = axios.create({
  baseURL: 'https://localhost:8080/api/',
});

api.interceptors.request.use(async (config) => {
  const headers = await getAuthHeader();
  config.headers = {
    ...config.headers,
    ...headers,
  };
  return config;
});

export default api;
