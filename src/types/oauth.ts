// Re-export OAuth types from kubernetesApi for backward compatibility
export type { OAuthProvider, OAuthConfig } from '../services/kubernetesApi'

export interface OAuthResponse {
  success: boolean
  provider: string
  code?: string
  state?: string
  error?: string
  token?: string
  userInfo?: {
    id: string
    email: string
    name: string
    avatar?: string
  }
}