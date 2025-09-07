/**
 * Mock Configuration Manager
 * 支持多种方式配置Mock模式：环境变量、URL参数、localStorage
 */

export class MockConfig {
  private static instance: MockConfig
  private mockEnabled: boolean | null = null

  private constructor() {}

  static getInstance(): MockConfig {
    if (!MockConfig.instance) {
      MockConfig.instance = new MockConfig()
    }
    return MockConfig.instance
  }

  /**
   * 检查是否启用Mock模式
   * 优先级: URL参数 > localStorage > 环境变量 > 默认值
   */
  isMockEnabled(): boolean {
    if (this.mockEnabled !== null) {
      return this.mockEnabled
    }

    // 1. 检查URL参数 (?mock=true 或 ?mock=false)
    const urlParams = new URLSearchParams(window.location.search)
    const mockParam = urlParams.get('mock')
    if (mockParam !== null) {
      this.mockEnabled = mockParam === 'true'
      // 保存到localStorage供下次使用
      localStorage.setItem('kubeasy-mock-enabled', this.mockEnabled.toString())
      console.info(`🔧 Mock mode set via URL parameter: ${this.mockEnabled}`)
      return this.mockEnabled
    }

    // 2. 检查localStorage设置
    const storedMock = localStorage.getItem('kubeasy-mock-enabled')
    if (storedMock !== null) {
      this.mockEnabled = storedMock === 'true'
      console.info(`🔧 Mock mode loaded from localStorage: ${this.mockEnabled}`)
      return this.mockEnabled
    }

    // 3. 检查环境变量 (Vite的方式)
    const envMock = import.meta.env.VITE_MOCK_ENABLED
    if (envMock !== undefined) {
      this.mockEnabled = envMock === 'true'
      console.info(`🔧 Mock mode set via environment variable: ${this.mockEnabled}`)
      return this.mockEnabled
    }

    // 4. 开发环境默认启用Mock，生产环境默认禁用
    this.mockEnabled = import.meta.env.DEV
    console.info(`🔧 Mock mode using default (DEV=${import.meta.env.DEV}): ${this.mockEnabled}`)
    return this.mockEnabled
  }

  /**
   * 动态设置Mock模式
   */
  setMockEnabled(enabled: boolean): void {
    this.mockEnabled = enabled
    localStorage.setItem('kubeasy-mock-enabled', enabled.toString())
    console.info(`🔧 Mock mode manually set to: ${enabled}`)
    
    // 触发页面刷新以应用新设置
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  /**
   * 重置Mock配置
   */
  resetMockConfig(): void {
    this.mockEnabled = null
    localStorage.removeItem('kubeasy-mock-enabled')
    console.info('🔧 Mock configuration reset')
  }

  /**
   * 获取当前配置来源
   */
  getConfigSource(): string {
    const urlParams = new URLSearchParams(window.location.search)
    const mockParam = urlParams.get('mock')
    
    if (mockParam !== null) return 'URL Parameter'
    if (localStorage.getItem('kubeasy-mock-enabled') !== null) return 'LocalStorage'
    if (import.meta.env.VITE_MOCK_ENABLED !== undefined) return 'Environment Variable'
    return 'Default (Development Mode)'
  }

  /**
   * 获取调试信息
   */
  getDebugInfo() {
    return {
      enabled: this.isMockEnabled(),
      source: this.getConfigSource(),
      urlParam: new URLSearchParams(window.location.search).get('mock'),
      localStorage: localStorage.getItem('kubeasy-mock-enabled'),
      envVar: import.meta.env.VITE_MOCK_ENABLED,
      isDev: import.meta.env.DEV
    }
  }
}

// 导出单例实例
export const mockConfig = MockConfig.getInstance()

// 全局调试方法（仅开发环境）
if (import.meta.env.DEV) {
  (window as any).__kubeasyMockConfig = {
    enable: () => mockConfig.setMockEnabled(true),
    disable: () => mockConfig.setMockEnabled(false),
    status: () => console.table(mockConfig.getDebugInfo()),
    reset: () => mockConfig.resetMockConfig()
  }
  
  console.info(`
🚀 KubeEasy Mock Configuration Debug Commands:
   __kubeasyMockConfig.enable()  - Enable mock mode
   __kubeasyMockConfig.disable() - Disable mock mode  
   __kubeasyMockConfig.status()  - Show current status
   __kubeasyMockConfig.reset()   - Reset configuration

💡 You can also use URL parameters: ?mock=true or ?mock=false
`)
}