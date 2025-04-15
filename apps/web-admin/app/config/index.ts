export const AUTH_API_URL = window.ENV?.PUBLIC_AUTH_API_URL ||
  window.ENV?.env?.PUBLIC_AUTH_API_URL ||
  "http://localhost:7300" // Fallback URL for development


export const argsSession = {
  baseURL: AUTH_API_URL,
  basePath: "/api/auth",
} as const
