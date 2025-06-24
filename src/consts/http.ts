// utils/httpClient.ts
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

instance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      const accessToken = user ? JSON.parse(user).accessToken : null;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const httpClient = {
  private: instance,
};
