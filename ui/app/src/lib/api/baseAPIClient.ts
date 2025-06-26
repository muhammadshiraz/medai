// lib/api/baseAPIClient.ts
import axios from "axios";

export const baseAPIClient = axios.create({
    baseURL: process.env.API_BASE_URL,
});

baseAPIClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  try {
    const storedAuth = localStorage.getItem("medai-auth");
    const token = storedAuth ? JSON.parse(storedAuth).token : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("Token parsing failed", err);
  }

  return config;
});
