import api from './api'
import { mockDataCache, MockDataService } from './mockData'
import { mockConfig } from './config'

export interface MenuItem {
  id: string
  title: string
  path?: string
  icon: string
  parentId?: string
  children?: MenuItem[]
  order: number
  enabled: boolean
  description?: string
  permissions?: string[]
  badge?: string | number
}

export interface MenuGroup {
  id: string
  title: string
  icon: string
  order: number
  enabled: boolean
  children: MenuItem[]
}

export interface ClusterInfo {
  name: string
  status: 'healthy' | 'warning' | 'error'
  nodes: number
  pods: number
  cpu: number
  memory: number
  version?: string
  endpoint?: string
}

export interface PodInfo {
  name: string
  namespace: string
  status: 'Running' | 'Pending' | 'Failed' | 'Succeeded'
  restarts: number
  age: string
  cpu: number
  memory: number
  node?: string
}

export interface DeploymentInfo {
  name: string
  namespace: string
  replicas: {
    desired: number
    current: number
    available: number
  }
  status: 'Available' | 'Progressing' | 'ReplicaFailure'
  age: string
  image: string
}

export interface ServiceInfo {
  name: string
  namespace: string
  type: 'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName'
  clusterIP: string
  externalIP?: string
  ports: Array<{
    port: number
    targetPort: number
    protocol: string
  }>
  age: string
}

export interface DashboardMetrics {
  clusters: number
  nodes: number
  pods: number
  services: number
  deployments: number
}

export interface OAuthProvider {
  id: string
  name: string
  icon: string
  iconType: 'emoji' | 'url' | 'component' | 'company'
  color: string
  enabled: boolean
  clientId?: string
  redirectUri?: string
  scope?: string
  authorizeUrl?: string
  buttonText?: string
}

export interface OAuthConfig {
  enabled: boolean
  showDivider: boolean
  dividerText: string
  providers: OAuthProvider[]
}

// Dynamic mock configuration - now controlled by config service

class KubernetesApiService {
  // Dashboard APIs
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const useMock = mockConfig.isMockEnabled()
    
    if (useMock) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200))
      return mockDataCache.dashboard
    }
    
    try {
      const response = await api.get('/dashboard/metrics')
      return response.data
    } catch {
      // Fallback to mock data if API fails
      console.warn('API call failed, falling back to mock data')
      return mockDataCache.dashboard
    }
  }

  // Cluster APIs
  async getClusters(): Promise<ClusterInfo[]> {
    const useMock = mockConfig.isMockEnabled()
    
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 600 + 300))
      return mockDataCache.clusters
    }
    
    try {
      const response = await api.get('/clusters')
      return response.data
    } catch {
      console.warn('API call failed, falling back to mock data')
      return mockDataCache.clusters
    }
  }

  async getClusterDetails(clusterName: string): Promise<ClusterInfo> {
    const useMock = mockConfig.isMockEnabled()
    
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 200))
      const cluster = mockDataCache.clusters.find(c => c.name === clusterName)
      if (!cluster) {
        throw new Error(`Cluster '${clusterName}' not found`)
      }
      return cluster
    }
    
    try {
      const response = await api.get(`/clusters/${clusterName}`)
      return response.data
    } catch (error) {
      // Fallback to mock data
      const cluster = mockDataCache.clusters.find(c => c.name === clusterName)
      if (cluster) return cluster
      throw new Error(`Failed to fetch cluster details: ${error}`)
    }
  }

  // Pod APIs
  async getPods(namespace?: string): Promise<PodInfo[]> {
    const useMock = mockConfig.isMockEnabled()
    
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 700 + 300))
      let pods = mockDataCache.pods
      if (namespace) {
        pods = pods.filter(pod => pod.namespace === namespace)
      }
      return pods
    }
    
    try {
      const params = namespace ? { namespace } : {}
      const response = await api.get('/pods', { params })
      return response.data
    } catch {
      let pods = mockDataCache.pods
      if (namespace) {
        pods = pods.filter(pod => pod.namespace === namespace)
      }
      return pods
    }
  }

  // Deployment APIs
  async getDeployments(namespace?: string): Promise<DeploymentInfo[]> {
    const useMock = mockConfig.isMockEnabled()
    
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 600 + 400))
      let deployments = mockDataCache.deployments
      if (namespace) {
        deployments = deployments.filter(dep => dep.namespace === namespace)
      }
      return deployments
    }
    
    try {
      const params = namespace ? { namespace } : {}
      const response = await api.get('/deployments', { params })
      return response.data
    } catch {
      let deployments = mockDataCache.deployments
      if (namespace) {
        deployments = deployments.filter(dep => dep.namespace === namespace)
      }
      return deployments
    }
  }

  async scaleDeployment(name: string, namespace: string, replicas: number): Promise<void> {
    const useMock = mockConfig.isMockEnabled()
    
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200))
      // Update mock data
      const deployment = mockDataCache.deployments.find(d => d.name === name && d.namespace === namespace)
      if (deployment) {
        deployment.replicas.desired = replicas
        deployment.replicas.current = Math.min(replicas, deployment.replicas.current)
        deployment.replicas.available = Math.min(deployment.replicas.current, deployment.replicas.available)
      }
      return
    }
    
    try {
      await api.patch(`/deployments/${namespace}/${name}/scale`, { replicas })
    } catch (error) {
      throw new Error(`Failed to scale deployment: ${error}`)
    }
  }

  // Service APIs
  async getServices(namespace?: string): Promise<ServiceInfo[]> {
    const useMock = mockConfig.isMockEnabled()
    
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300))
      let services = mockDataCache.services
      if (namespace) {
        services = services.filter(svc => svc.namespace === namespace)
      }
      return services
    }
    
    try {
      const params = namespace ? { namespace } : {}
      const response = await api.get('/services', { params })
      return response.data
    } catch {
      let services = mockDataCache.services
      if (namespace) {
        services = services.filter(svc => svc.namespace === namespace)
      }
      return services
    }
  }

  // Authentication API
  async login(username: string, password: string): Promise<{ token: string; user: { username: string; email?: string; roles?: string[] } }> {
    const useMock = mockConfig.isMockEnabled()
    
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
      
      // Mock authentication logic
      const validCredentials = [
        { username: 'dukuan', password: 'Q_Q727585266', roles: ['admin'] },
        { username: 'admin', password: 'admin123', roles: ['admin'] },
        { username: 'user', password: 'user123', roles: ['user'] },
        { username: 'developer', password: 'dev123', roles: ['developer'] }
      ]
      
      const user = validCredentials.find(cred => cred.username === username && cred.password === password)
      if (!user) {
        throw new Error('Invalid username or password')
      }
      
      return {
        token: `mock-jwt-token-${Date.now()}-${Math.random().toString(36).substring(2)}`,
        user: {
          username: user.username,
          email: `${user.username}@kubeasy.com`,
          roles: user.roles
        }
      }
    }
    
    try {
      const response = await api.post('/auth/login', { username, password })
      return response.data
    } catch {
      throw new Error('Authentication failed')
    }
  }

  async logout(): Promise<void> {
    const useMock = mockConfig.isMockEnabled()
    
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, 200))
      return
    }
    
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Even if logout fails on server, we clear local storage
      console.warn('Logout request failed:', error)
    }
  }

  async validateToken(): Promise<boolean> {
    const useMock = mockConfig.isMockEnabled()
    
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, 300))
      // In mock mode, tokens are always valid if present
      const token = localStorage.getItem('kubeasy-token')
      return !!token && token.startsWith('mock-jwt-token')
    }
    
    try {
      const response = await api.get('/auth/validate')
      return response.status === 200
    } catch {
      return false
    }
  }

  // Menu APIs
  async getMenus(): Promise<MenuGroup[]> {
    const useMock = mockConfig.isMockEnabled()
    
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
      return MockDataService.generateMenus()
    }
    
    try {
      const response = await api.get('/system/menus')
      return response.data
    } catch {
      // Fallback to mock data if API fails
      return MockDataService.generateMenus()
    }
  }

  async updateMenuPermissions(userId: string, menuIds: string[]): Promise<void> {
    const useMock = mockConfig.isMockEnabled()
    
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300))
      return
    }
    
    try {
      await api.post('/system/user-menus', { userId, menuIds })
    } catch (error) {
      throw new Error(`Failed to update menu permissions: ${error}`)
    }
  }

  // OAuth APIs
  async getOAuthConfig(): Promise<OAuthConfig> {
    const useMock = mockConfig.isMockEnabled()
    
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
      return {
        enabled: true,
        showDivider: true,
        dividerText: 'Or continue with',
        providers: [
          {
            id: 'google',
            name: 'Google',
            icon: 'oauth:google',
            iconType: 'component',
            color: '#4285f4',
            enabled: true,
            clientId: 'google-client-id',
            redirectUri: `${globalThis.location.origin}/auth/callback/google`,
            scope: 'openid profile email',
            authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
            buttonText: 'Google'
          },
          {
            id: 'github',
            name: 'GitHub',
            icon: 'oauth:github',
            iconType: 'component',
            color: '#181717',
            enabled: true,
            clientId: 'github-client-id',
            redirectUri: `${globalThis.location.origin}/auth/callback/github`,
            scope: 'user:email',
            authorizeUrl: 'https://github.com/login/oauth/authorize',
            buttonText: 'GitHub'
          },
          {
            id: 'feishu',
            name: 'Feishu',
            icon: 'oauth:feishu',
            iconType: 'component',
            color: '#00d4aa',
            enabled: true,
            clientId: 'feishu-app-id',
            redirectUri: `${globalThis.location.origin}/auth/callback/feishu`,
            scope: 'user:profile',
            authorizeUrl: 'https://open.feishu.cn/open-apis/authen/v1/index',
            buttonText: '飞书'
          },
          {
            id: 'wechat',
            name: 'WeChat',
            icon: 'oauth:wechat',
            iconType: 'component',
            color: '#07c160',
            enabled: true,
            clientId: 'wechat-app-id',
            redirectUri: `${globalThis.location.origin}/auth/callback/wechat`,
            scope: 'snsapi_userinfo',
            authorizeUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize',
            buttonText: '微信'
          }
        ]
      }
    }
    
    try {
      const response = await api.get('/auth/oauth/config')
      return response.data
    } catch {
      // Fallback to mock data if API fails
      return this.getOAuthConfig() // This will use mock mode
    }
  }

  async updateOAuthConfig(config: OAuthConfig): Promise<void> {
    const useMock = mockConfig.isMockEnabled()
    
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 500))
      console.log('Mock: OAuth configuration updated', config)
      return
    }
    
    try {
      await api.post('/auth/oauth/config', config)
    } catch (error) {
      throw new Error(`Failed to update OAuth configuration: ${error}`)
    }
  }
}

export const kubernetesApi = new KubernetesApiService()
export default kubernetesApi