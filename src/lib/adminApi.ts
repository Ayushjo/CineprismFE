"use client";

import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.thecineprism.com/api/v1";
const TOKEN_KEY = "cineprism_auth_token";

/** Axios instance for admin calls — injects the Bearer token + cookies. */
export const adminApi = axios.create({
  baseURL: API,
  withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const API_BASE = API;
