const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

if (!apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL must be defined in the frontend .env file')
}

export const API_BASE_URL = apiBaseUrl

export const GOOGLE_CLIENT_ID = googleClientId