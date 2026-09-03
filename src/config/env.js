const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL must be defined in the frontend .env file')
}

export const API_BASE_URL = apiBaseUrl
