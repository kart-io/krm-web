import { ref, reactive } from 'vue'
import { kubernetesApi, type OAuthConfig, type OAuthProvider } from './kubernetesApi'
import type { OAuthResponse } from '../types/oauth'

// Mock OAuth 配置 - 在真实应用中应该从后台API获取
const mockOAuthConfig: OAuthConfig = {
  enabled: true,
  showDivider: true,
  dividerText: 'Or continue with',
  providers: [
    {
      id: 'google',
      name: 'Google',
      icon: 'company:google',
      iconType: 'company',
      color: '#4285f4',
      enabled: true,
      clientId: 'google-client-id',
      redirectUri: `${window.location.origin}/auth/callback/google`,
      scope: 'openid profile email',
      authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      buttonText: 'Google'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: 'company:github',
      iconType: 'company',
      color: '#333333',
      enabled: true,
      clientId: 'github-client-id',
      redirectUri: `${window.location.origin}/auth/callback/github`,
      scope: 'user:email',
      authorizeUrl: 'https://github.com/login/oauth/authorize',
      buttonText: 'GitHub'
    },
    {
      id: 'feishu',
      name: 'Feishu',
      icon: 'company:feishu',
      iconType: 'company',
      color: '#1677FF',
      enabled: true,
      clientId: 'feishu-app-id',
      redirectUri: `${window.location.origin}/auth/callback/feishu`,
      scope: 'user:profile',
      authorizeUrl: 'https://open.feishu.cn/open-apis/authen/v1/index',
      buttonText: '飞书'
    },
    {
      id: 'dingtalk',
      name: 'DingTalk',
      icon: '💼',
      iconType: 'emoji',
      color: '#1890ff',
      enabled: false, // 示例：禁用的提供商
      buttonText: '钉钉'
    },
    {
      id: 'wechat',
      name: 'WeChat',
      icon: 'company:wechat',
      iconType: 'company',
      color: '#07c160',
      enabled: true,
      buttonText: '微信'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'company:facebook',
      iconType: 'company',
      color: '#1877f2',
      enabled: false,
      buttonText: 'Facebook'
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      icon: 'company:microsoft',
      iconType: 'company',
      color: '#0078d4',
      enabled: false,
      buttonText: 'Microsoft'
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: 'company:apple',
      iconType: 'company',
      color: '#000000',
      enabled: false,
      buttonText: 'Apple'
    }
  ]
}

class OAuthService {
  private config = reactive<OAuthConfig>({ enabled: false, showDivider: true, dividerText: 'Or continue with', providers: [] })
  private loading = ref(false)

  // 获取OAuth配置
  async getConfig(): Promise<OAuthConfig> {
    try {
      const oauthConfig = await kubernetesApi.getOAuthConfig()
      // Update local reactive config
      Object.assign(this.config, oauthConfig)
      return oauthConfig
    } catch (error) {
      console.error('Failed to load OAuth config from API:', error)
      // Return default config if API fails
      return this.config
    }
  }

  // 获取启用的提供商
  getEnabledProviders(): OAuthProvider[] {
    return this.config.providers.filter(provider => provider.enabled)
  }

  // 生成OAuth授权URL
  generateAuthUrl(provider: OAuthProvider): string {
    if (!provider.authorizeUrl) {
      console.warn(`Provider ${provider.id} does not have authorizeUrl configured`)
      return '#'
    }

    const params = new URLSearchParams({
      client_id: provider.clientId || '',
      redirect_uri: provider.redirectUri || '',
      scope: provider.scope || '',
      response_type: 'code',
      state: this.generateState(provider.id)
    })

    return `${provider.authorizeUrl}?${params.toString()}`
  }

  // 生成随机state参数
  private generateState(providerId: string): string {
    const randomString = Math.random().toString(36).substring(2, 15)
    const timestamp = Date.now().toString()
    return btoa(`${providerId}:${timestamp}:${randomString}`)
  }

  // 处理OAuth回调
  async handleCallback(provider: string, code: string, state: string): Promise<OAuthResponse> {
    this.loading.value = true
    
    try {
      // 在真实应用中，这里会调用后台API处理OAuth回调
      // const response = await api.post('/auth/oauth/callback', {
      //   provider,
      //   code,
      //   state
      // })
      
      // 模拟API处理
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock成功响应
      return {
        success: true,
        provider,
        token: `mock-jwt-token-${provider}-${Date.now()}`,
        userInfo: {
          id: `${provider}-user-123`,
          email: `user@${provider}.com`,
          name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
          avatar: `https://ui-avatars.com/api/?name=${provider}&background=random`
        }
      }
    } catch (error) {
      return {
        success: false,
        provider,
        error: error instanceof Error ? error.message : 'OAuth authentication failed'
      }
    } finally {
      this.loading.value = false
    }
  }

  // 启动OAuth授权流程
  startAuth(provider: OAuthProvider): void {
    const authUrl = this.generateAuthUrl(provider)
    if (authUrl === '#') {
      console.error(`Cannot start OAuth for provider ${provider.id}: missing configuration`)
      return
    }

    // 保存当前provider到localStorage，用于回调处理
    localStorage.setItem('oauth_provider', provider.id)
    localStorage.setItem('oauth_timestamp', Date.now().toString())

    // 跳转到OAuth授权页面
    window.location.href = authUrl
  }

  // Mock OAuth登录（用于开发测试）
  async mockOAuthLogin(provider: OAuthProvider): Promise<OAuthResponse> {
    this.loading.value = true
    
    try {
      // 模拟授权延迟
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      return {
        success: true,
        provider: provider.id,
        token: `mock-jwt-token-${provider.id}-${Date.now()}`,
        userInfo: {
          id: `${provider.id}-user-${Math.random().toString(36).substring(2, 8)}`,
          email: `user@${provider.name.toLowerCase()}.com`,
          name: `${provider.name} Test User`,
          avatar: `https://ui-avatars.com/api/?name=${provider.name}&background=random&color=fff`
        }
      }
    } catch (error) {
      return {
        success: false,
        provider: provider.id,
        error: 'Mock OAuth login failed'
      }
    } finally {
      this.loading.value = false
    }
  }

  // 更新配置（管理员功能）
  async updateConfig(newConfig: Partial<OAuthConfig>): Promise<void> {
    try {
      const fullConfig = { ...this.config, ...newConfig }
      await kubernetesApi.updateOAuthConfig(fullConfig)
      // Update local reactive config only after successful API call
      Object.assign(this.config, newConfig)
    } catch (error) {
      console.error('Failed to update OAuth config:', error)
      throw error
    }
  }

  // Getters
  get isLoading() {
    return this.loading.value
  }

  get oauthConfig() {
    return this.config
  }
}

export const oauthService = new OAuthService()
export default oauthService