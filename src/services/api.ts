import axios from 'axios'

// Resolve API base URL from env/query with sensible fallbacks
const resolveBaseUrl = (): string => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const paramBase = urlParams.get('apiBase')
    if (paramBase) return paramBase
  } catch {
    // ignore if not in browser
  }

  const envBase = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (envBase && envBase.length > 0) return envBase

  // Defaults by mode
  if (import.meta.env.DEV) return 'http://localhost:3000/api'
  return 'http://www.kubeasy.com/api'
}

const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: Number(import.meta.env.VITE_TIMEOUT_MS ?? 10000),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kubeasy-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('kubeasy-token')
      localStorage.removeItem('kubeasy-user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
