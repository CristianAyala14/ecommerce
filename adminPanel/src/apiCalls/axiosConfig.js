import axios from "axios";
import { store } from "../redux/store.js";
import { setAccessToken, defaultState } from "../redux/user/userSlice.js";
import { refreshTokenReq } from "./authCalls.js";

const base_url = "http://localhost:8080/api";

/* =====================================================
   AXIOS SIN AUTH → RUTAS PÚBLICAS
===================================================== */
export const axiosCall = axios.create({
  baseURL: base_url,
  withCredentials: true,
});

axiosCall.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      status: error.response?.status || 0,
      message:
        error.response?.data?.message || "No server response",
    };
    return Promise.reject(customError);
  }
);

/* =====================================================
   AXIOS CON AUTH → RUTAS PROTEGIDAS
===================================================== */
export const axiosWithAuth = axios.create({
  baseURL: base_url,
  withCredentials: true,
});

axiosWithAuth.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.user.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosWithAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ⛔ No response (server caído, CORS, etc)
    if (!error.response) {
      return Promise.reject({
        status: 0,
        message: "No server response",
      });
    }

    // 🔁 TOKEN EXPIRADO
    if (
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await refreshTokenReq();

        if (res.ok) {
          store.dispatch(setAccessToken(res.payload.accessToken));

          originalRequest.headers.Authorization = `Bearer ${res.payload.accessToken}`;
          return axiosWithAuth(originalRequest);
        }

        if (res.status === 401) {
          store.dispatch(defaultState());
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // ❌ ERROR NORMAL
    return Promise.reject({
      status: error.response.status,
      message:
        error.response.data?.message
    });
  }
);
