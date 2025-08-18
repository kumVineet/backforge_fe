import { config } from "./config";

// API version configuration
export const API_VERSIONS = {
  auth: "v1",
  users: "v1",
  payments: "v2",
  analytics: "v3",
  notifications: "v1",
  files: "v2",
  reports: "v3",
  // Add more API groups as needed
} as const;

// Type for API groups
export type ApiGroup = keyof typeof API_VERSIONS;

// Helper function to build API URLs with versioning
export function buildApiUrl(
  endpoint: string,
  apiGroup?: ApiGroup,
  version?: string
): string {
  const apiVersion = version || (apiGroup ? API_VERSIONS[apiGroup] : "v1");
  return `${config.api.baseUrl}/api/${apiVersion}${endpoint}`;
}

// Helper function to get base URL for a specific API group
export function getApiBaseUrl(apiGroup?: ApiGroup, version?: string): string {
  const apiVersion = version || (apiGroup ? API_VERSIONS[apiGroup] : "v1");
  return `${config.api.baseUrl}/api/${apiVersion}`;
}

// Auth endpoints
export const authEndpoints = {
  login: () => buildApiUrl("/auth/login", "auth"),
  register: () => buildApiUrl("/auth/register", "auth"),
  logout: () => buildApiUrl("/auth/logout", "auth"),
  logoutAll: () => buildApiUrl("/auth/logout-all", "auth"),
  refresh: () => buildApiUrl("/auth/refresh", "auth"),
  verify: () => buildApiUrl("/auth/verify", "auth"),
  sessions: () => buildApiUrl("/auth/sessions", "auth"),
  deleteSession: (sessionId: string) =>
    buildApiUrl(`/auth/sessions/${sessionId}`, "auth"),
  me: () => buildApiUrl("/auth/me", "auth"),
  profile: () => buildApiUrl("/auth/profile", "auth"),
  forgotPassword: () => buildApiUrl("/auth/forgot-password", "auth"),
  resetPassword: () => buildApiUrl("/auth/reset-password", "auth"),
  changePassword: () => buildApiUrl("/auth/change-password", "auth"),
} as const;

// User endpoints
export const userEndpoints = {
  list: (filters?: Record<string, any>) => {
    const queryParams = filters
      ? `?${new URLSearchParams(filters).toString()}`
      : "";
    return buildApiUrl(`/users${queryParams}`, "users");
  },
  detail: (id: string | number) => buildApiUrl(`/users/${id}`, "users"),
  create: () => buildApiUrl("/users", "users"),
  update: (id: string | number) => buildApiUrl(`/users/${id}`, "users"),
  delete: (id: string | number) => buildApiUrl(`/users/${id}`, "users"),
  profile: () => buildApiUrl("/users/profile", "users"),
  updateProfile: () => buildApiUrl("/users/profile", "users"),
  avatar: (id: string | number) => buildApiUrl(`/users/${id}/avatar`, "users"),
  uploadAvatar: (id: string | number) =>
    buildApiUrl(`/users/${id}/avatar`, "users"),
} as const;

// Payment endpoints (v2)
export const paymentEndpoints = {
  create: () => buildApiUrl("/payments/create", "payments"),
  list: (filters?: Record<string, any>) => {
    const queryParams = filters
      ? `?${new URLSearchParams(filters).toString()}`
      : "";
    return buildApiUrl(`/payments${queryParams}`, "payments");
  },
  detail: (id: string | number) => buildApiUrl(`/payments/${id}`, "payments"),
  update: (id: string | number) => buildApiUrl(`/payments/${id}`, "payments"),
  delete: (id: string | number) => buildApiUrl(`/payments/${id}`, "payments"),
  webhook: () => buildApiUrl("/payments/webhook", "payments"),
  refund: (id: string | number) =>
    buildApiUrl(`/payments/${id}/refund`, "payments"),
  capture: (id: string | number) =>
    buildApiUrl(`/payments/${id}/capture`, "payments"),
} as const;

// Analytics endpoints (v3)
export const analyticsEndpoints = {
  dashboard: () => buildApiUrl("/analytics/dashboard", "analytics"),
  reports: () => buildApiUrl("/analytics/reports", "analytics"),
  metrics: () => buildApiUrl("/analytics/metrics", "analytics"),
  export: (format: "csv" | "json" | "pdf") =>
    buildApiUrl(`/analytics/export?format=${format}`, "analytics"),
  customReport: () => buildApiUrl("/analytics/custom-report", "analytics"),
} as const;

// Notification endpoints
export const notificationEndpoints = {
  list: (filters?: Record<string, any>) => {
    const queryParams = filters
      ? `?${new URLSearchParams(filters).toString()}`
      : "";
    return buildApiUrl(`/notifications${queryParams}`, "notifications");
  },
  markAsRead: (id: string | number) =>
    buildApiUrl(`/notifications/${id}/read`, "notifications"),
  markAllAsRead: () =>
    buildApiUrl("/notifications/mark-all-read", "notifications"),
  delete: (id: string | number) =>
    buildApiUrl(`/notifications/${id}`, "notifications"),
  settings: () => buildApiUrl("/notifications/settings", "notifications"),
  updateSettings: () => buildApiUrl("/notifications/settings", "notifications"),
} as const;

// File management endpoints (v2)
export const fileEndpoints = {
  upload: () => buildApiUrl("/files/upload", "files"),
  list: (filters?: Record<string, any>) => {
    const queryParams = filters
      ? `?${new URLSearchParams(filters).toString()}`
      : "";
    return buildApiUrl(`/files${queryParams}`, "files");
  },
  detail: (id: string | number) => buildApiUrl(`/files/${id}`, "files"),
  download: (id: string | number) =>
    buildApiUrl(`/files/${id}/download`, "files"),
  delete: (id: string | number) => buildApiUrl(`/files/${id}`, "files"),
  share: (id: string | number) => buildApiUrl(`/files/${id}/share`, "files"),
  unshare: (id: string | number) =>
    buildApiUrl(`/files/${id}/unshare`, "files"),
  move: (id: string | number) => buildApiUrl(`/files/${id}/move`, "files"),
  copy: (id: string | number) => buildApiUrl(`/files/${id}/copy`, "files"),
} as const;

// Report endpoints (v3)
export const reportEndpoints = {
  generate: () => buildApiUrl("/reports/generate", "reports"),
  list: (filters?: Record<string, any>) => {
    const queryParams = filters
      ? `?${new URLSearchParams(filters).toString()}`
      : "";
    return buildApiUrl(`/reports${queryParams}`, "reports");
  },
  detail: (id: string | number) => buildApiUrl(`/reports/${id}`, "reports"),
  download: (id: string | number, format: "pdf" | "excel" | "csv") =>
    buildApiUrl(`/reports/${id}/download?format=${format}`, "reports"),
  schedule: () => buildApiUrl("/reports/schedule", "reports"),
  delete: (id: string | number) => buildApiUrl(`/reports/${id}`, "reports"),
} as const;

// Generic endpoint builder for any resource
export function createResourceEndpoints(
  resource: string,
  apiGroup?: ApiGroup,
  version?: string
) {
  const baseUrl = getApiBaseUrl(apiGroup, version);

  return {
    list: (filters?: Record<string, any>) => {
      const queryParams = filters
        ? `?${new URLSearchParams(filters).toString()}`
        : "";
      return `${baseUrl}/${resource}${queryParams}`;
    },
    detail: (id: string | number) => `${baseUrl}/${resource}/${id}`,
    create: () => `${baseUrl}/${resource}`,
    update: (id: string | number) => `${baseUrl}/${resource}/${id}`,
    delete: (id: string | number) => `${baseUrl}/${resource}/${id}`,
    bulkCreate: () => `${baseUrl}/${resource}/bulk`,
    bulkUpdate: () => `${baseUrl}/${resource}/bulk`,
    bulkDelete: () => `${baseUrl}/${resource}/bulk`,
  };
}

// Export all endpoints for easy access
export const endpoints = {
  auth: authEndpoints,
  users: userEndpoints,
  payments: paymentEndpoints,
  analytics: analyticsEndpoints,
  notifications: notificationEndpoints,
  files: fileEndpoints,
  reports: reportEndpoints,
  // Generic resource endpoints
  createResource: createResourceEndpoints,
} as const;

// Type for all endpoint functions
export type EndpointFunction = (...args: any[]) => string;

// Utility function to get endpoint by path
export function getEndpointByPath(path: string): string | null {
  // This function can be used to find endpoints by their path
  // Useful for debugging or dynamic endpoint resolution
  const allEndpoints = [
    ...Object.values(authEndpoints),
    ...Object.values(userEndpoints),
    ...Object.values(paymentEndpoints),
    ...Object.values(analyticsEndpoints),
    ...Object.values(notificationEndpoints),
    ...Object.values(fileEndpoints),
    ...Object.values(reportEndpoints),
  ];

  for (const endpoint of allEndpoints) {
    if (typeof endpoint === "function") {
      try {
        const url = endpoint();
        if (url.includes(path)) {
          return url;
        }
      } catch {
        // Skip endpoints that require parameters
      }
    }
  }

  return null;
}

// Debug function to log all available endpoints
export function logAllEndpoints() {
  console.log("Available API Endpoints:");
  console.log("Auth:", Object.keys(authEndpoints));
  console.log("Users:", Object.keys(userEndpoints));
  console.log("Payments:", Object.keys(paymentEndpoints));
  console.log("Analytics:", Object.keys(analyticsEndpoints));
  console.log("Notifications:", Object.keys(notificationEndpoints));
  console.log("Files:", Object.keys(fileEndpoints));
  console.log("Reports:", Object.keys(reportEndpoints));
}
