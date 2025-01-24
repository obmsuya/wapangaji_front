import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { base_url } from "./utils";

const api = axios.create({
  baseURL: `${base_url}/api/v1/`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const access = await AsyncStorage.getItem("access");
    if (access) {
      config.headers["Authorization"] = `Bearer ${access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = await AsyncStorage.getItem("refresh");

        if (!refresh) {
          // Clear stored tokens since refresh token is missing
          await AsyncStorage.multiRemove(["access", "refresh"]);
          return Promise.reject(error);
        }

        const response = await axios.post(
          `${base_url}/api/v1/auth/token/refresh/`,
          refresh
        );

        const { access: newAccess, refresh: newRefresh } = response.data;

        await AsyncStorage.setItem("access", newAccess);
        await AsyncStorage.setItem("refresh", newRefresh);

        // Update the failed request with new token and retry
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Clear tokens on refresh failure
        await AsyncStorage.multiRemove(["access", "refresh"]);
        router.push("/(auth)/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
