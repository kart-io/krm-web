import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { kubernetesApi } from '../services/kubernetesApi'

export interface User {
  username: string
  email?: string
  roles?: string[]
  avatar?: string
  provider?: string
  providerId?: string
}

export interface OAuthLoginData {
  token: string
  provider: string
  userInfo: {
    id: string
    email: string
    name: string
    avatar?: string
  }
}

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Initialize from localStorage
  const storedToken = localStorage.getItem('kubeasy-token')
  const storedUser = localStorage.getItem('kubeasy-user')
  
  if (storedToken && storedUser) {
    token.value = storedToken
    user.value = JSON.parse(storedUser)
    isAuthenticated.value = true
    
    // Set default axios header
    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await kubernetesApi.login(username, password)
      
      // Store in state
      token.value = response.token
      user.value = response.user
      isAuthenticated.value = true

      // Persist to localStorage
      localStorage.setItem('kubeasy-token', response.token)
      localStorage.setItem('kubeasy-user', JSON.stringify(response.user))

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`

      return true
    } catch (apiError: any) {
      error.value = apiError.message || 'Login failed. Please try again.'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    // Clear state
    isAuthenticated.value = false
    user.value = null
    token.value = null
    error.value = null

    // Clear localStorage
    localStorage.removeItem('kubeasy-token')
    localStorage.removeItem('kubeasy-user')

    // Clear axios default header
    delete axios.defaults.headers.common['Authorization']
  }

  const loginWithOAuth = async (oauthData: OAuthLoginData): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      // 在真实应用中，应该将OAuth数据发送到后台验证
      // const response = await kubernetesApi.loginWithOAuth(oauthData)
      
      // Mock OAuth登录处理
      const mockUser: User = {
        username: oauthData.userInfo.name,
        email: oauthData.userInfo.email,
        roles: ['user'],
        avatar: oauthData.userInfo.avatar,
        provider: oauthData.provider,
        providerId: oauthData.userInfo.id
      }

      // Store in state
      token.value = oauthData.token
      user.value = mockUser
      isAuthenticated.value = true

      // Persist to localStorage
      localStorage.setItem('kubeasy-token', oauthData.token)
      localStorage.setItem('kubeasy-user', JSON.stringify(mockUser))

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${oauthData.token}`

      return true
    } catch (apiError: any) {
      error.value = apiError.message || 'OAuth login failed. Please try again.'
      return false
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    isAuthenticated,
    user,
    token,
    loading,
    error,
    login,
    loginWithOAuth,
    logout,
    clearError
  }
})