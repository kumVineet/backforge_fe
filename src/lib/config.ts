// Environment configuration
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
    timeout: 10000,
  },
  app: {
    name: "BackForge",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  },
  auth: {
    tokenKey: "auth-token",
    refreshTokenKey: "refresh-token",
  },
} as const;


// Weather configuration
export const weatherConfig = {
  apiKey: process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY,
  baseUrl: 'https://api.openweathermap.org/data/2.5',
  units: 'metric',
} as const;

// Note: All endpoints are now managed in src/lib/endpoints.ts
// This provides better organization and dynamic versioning support
