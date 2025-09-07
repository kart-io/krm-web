import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://www.kubeasy.com/api', // Default API base URL
  timeout: 10000,
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