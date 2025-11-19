// lib/api-client.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosRequestHeaders,
} from "axios";
import { getToken } from "./helpers";

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return getToken();
}

// Create a pre-configured axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: "/", // calling Next.js API routes like "/api/..."
  withCredentials: false,
});

// Attach Bearer token + JSON headers
apiClient.interceptors.request.use(
  (config) => {
    // Ensure we always have a headers object, typed as AxiosRequestHeaders
    const headers: AxiosRequestHeaders = (config.headers ??
      {}) as AxiosRequestHeaders;

    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // For non-GET requests, ensure Content-Type is set
    if (
      config.method &&
      config.method.toLowerCase() !== "get" &&
      !headers["Content-Type"]
    ) {
      headers["Content-Type"] = "application/json";
    }

    config.headers = headers;
    return config;
  },
  (error) => Promise.reject(error)
);

// Full helper (similar to your old authorizedFetch)
export async function authorizedFetch<T = any>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<{ res: AxiosResponse<T>; data: T }> {
  const res = await apiClient.request<T>({
    url,
    ...config,
  });

  return { res, data: res.data };
}

// Convenience wrappers (optional)
export async function get<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await apiClient.get<T>(url, config);
  return res.data;
}

export async function post<TBody = any, TResp = any>(
  url: string,
  body: TBody,
  config?: AxiosRequestConfig
): Promise<TResp> {
  const res = await apiClient.post<TResp>(url, body, config);
  return res.data;
}

export async function patch<TBody = any, TResp = any>(
  url: string,
  body: TBody,
  config?: AxiosRequestConfig
): Promise<TResp> {
  const res = await apiClient.patch<TResp>(url, body, config);
  return res.data;
}

export async function del<TResp = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<TResp> {
  const res = await apiClient.delete<TResp>(url, config);
  return res.data;
}
