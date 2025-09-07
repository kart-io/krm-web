<template>
  <div v-if="enabledProviders.length > 0" class="oauth-container">
    <!-- 分隔线 -->
    <div v-if="config.showDivider" class="oauth-divider">
      <div class="divider-line"></div>
      <span class="divider-text">{{ config.dividerText || 'Or continue with' }}</span>
      <div class="divider-line"></div>
    </div>

    <!-- OAuth 按钮组 -->
    <div class="oauth-buttons">
      <button
        v-for="provider in enabledProviders"
        :key="provider.id"
        @click="handleOAuthLogin(provider)"
        :disabled="loading || oauthService.isLoading"
        class="oauth-button"
        :style="{ '--provider-color': provider.color }"
        :title="provider.buttonText || `Login with ${provider.name}`"
      >
        <div class="oauth-button-content">
          <!-- Provider Icon -->
          <div class="oauth-icon">
            <IconRenderer 
              :icon="provider.icon" 
              size="md"
              class="oauth-provider-icon"
            />
          </div>
          
          <!-- Provider Name -->
          <span class="oauth-text">
            {{ provider.buttonText || `Continue with ${provider.name}` }}
          </span>
          
          <!-- Loading Spinner -->
          <div v-if="loadingProvider === provider.id" class="oauth-spinner">
            <div class="spinner"></div>
          </div>
        </div>
        
        <!-- Button Glow Effect -->
        <div class="oauth-glow"></div>
      </button>
    </div>

    <!-- OAuth 状态提示 -->
    <div v-if="oauthError" class="oauth-error">
      <span class="error-icon">⚠️</span>
      <span>{{ oauthError }}</span>
    </div>

    <div v-if="oauthSuccess" class="oauth-success">
      <span class="success-icon">✅</span>
      <span>{{ oauthSuccess }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import oauthService from '../services/oauthConfig'
import IconRenderer from './IconRenderer.vue'
import type { OAuthProvider, OAuthResponse } from '../types/oauth'

const router = useRouter()
const authStore = useAuthStore()

// Props
interface Props {
  loading?: boolean
  mockMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  mockMode: true // 开发模式下使用mock，生产环境设为false
})

// Reactive data
const config = ref(oauthService.oauthConfig)
const loadingProvider = ref<string | null>(null)
const oauthError = ref('')
const oauthSuccess = ref('')

// Computed - 只显示已配置的提供商（有clientId的）
const enabledProviders = computed(() => 
  oauthService.getEnabledProviders().filter(provider => provider.clientId)
)

// Methods
const handleOAuthLogin = async (provider: OAuthProvider) => {
  if (props.loading || oauthService.isLoading) return

  loadingProvider.value = provider.id
  oauthError.value = ''
  oauthSuccess.value = ''

  try {
    let result: OAuthResponse

    if (props.mockMode) {
      // Mock模式 - 用于开发测试
      oauthSuccess.value = `Connecting to ${provider.name}...`
      result = await oauthService.mockOAuthLogin(provider)
    } else {
      // 真实OAuth流程
      oauthService.startAuth(provider)
      return // startAuth会导致页面跳转，所以直接返回
    }

    if (result.success && result.token && result.userInfo) {
      oauthSuccess.value = `Successfully connected to ${provider.name}`
      
      // 使用OAuth结果登录
      const loginSuccess = await authStore.loginWithOAuth({
        token: result.token,
        provider: result.provider,
        userInfo: result.userInfo
      })

      if (loginSuccess) {
        setTimeout(() => {
          router.push('/')
        }, 1000)
      } else {
        oauthError.value = 'Failed to complete OAuth login'
      }
    } else {
      oauthError.value = result.error || `Failed to authenticate with ${provider.name}`
    }
  } catch (error) {
    oauthError.value = error instanceof Error ? error.message : `OAuth login failed`
  } finally {
    loadingProvider.value = null
  }
}

const clearMessages = () => {
  oauthError.value = ''
  oauthSuccess.value = ''
}

// Lifecycle
onMounted(async () => {
  try {
    const oauthConfig = await oauthService.getConfig()
    config.value = oauthConfig
  } catch (error) {
    console.error('Failed to load OAuth config:', error)
  }
})

// 监听消息变化，自动清除
let messageTimer: number
const scheduleMessageClear = () => {
  if (messageTimer) clearTimeout(messageTimer)
  messageTimer = setTimeout(clearMessages, 5000)
}

// 监听错误和成功消息变化
import { watch } from 'vue'
watch([oauthError, oauthSuccess], () => {
  if (oauthError.value || oauthSuccess.value) {
    scheduleMessageClear()
  }
})
</script>

<style scoped>
.oauth-container {
  width: 100%;
  margin-top: 1.5rem;
}

/* 分隔线 */
.oauth-divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  opacity: 0.8;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(100, 116, 139, 0.4) 50%, 
    transparent 100%);
}

.divider-text {
  margin: 0 1rem;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  text-shadow: 0 0 10px rgba(148, 163, 184, 0.3);
}

/* OAuth 按钮组 */
.oauth-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.oauth-button {
  position: relative;
  width: 100%;
  padding: 0.75rem 0.5rem;
  background: rgba(51, 65, 85, 0.6);
  border: 1px solid rgba(100, 116, 139, 0.4);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
  min-height: 48px;
}

.oauth-button:hover {
  border-color: var(--provider-color, #3b82f6);
  background: rgba(51, 65, 85, 0.8);
  transform: translateY(-2px);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 8px 25px rgba(0, 0, 0, 0.2),
    0 0 20px color-mix(in srgb, var(--provider-color, #3b82f6) 30%, transparent);
}

.oauth-button:active {
  transform: translateY(0);
}

.oauth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.oauth-button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  z-index: 2;
  flex-direction: column;
}

/* OAuth 图标 */
.oauth-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
}

.emoji-icon {
  font-size: 1.1rem;
  filter: drop-shadow(0 0 8px color-mix(in srgb, var(--provider-color, #3b82f6) 50%, transparent));
}

.image-icon {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 3px;
  filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.3));
}

.component-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--provider-color, #3b82f6);
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--provider-color, #3b82f6) 50%, transparent));
}

/* OAuth 文字 */
.oauth-text {
  color: #f8fafc;
  font-weight: 500;
  font-size: 0.75rem;
  text-shadow: 0 0 10px rgba(248, 250, 252, 0.3);
  text-align: center;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 加载动画 */
.oauth-spinner {
  position: absolute;
  right: 1rem;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid var(--provider-color, #3b82f6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 发光效果 */
.oauth-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, 
    color-mix(in srgb, var(--provider-color, #3b82f6) 20%, transparent) 0%, 
    transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.oauth-button:hover .oauth-glow {
  opacity: 1;
  animation: oauthPulse 2s infinite;
}

@keyframes oauthPulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.05); opacity: 0.6; }
}

/* 状态消息 */
.oauth-error,
.oauth-success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  margin-top: 1rem;
  backdrop-filter: blur(10px);
  animation: slideIn 0.3s ease;
}

.oauth-error {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}

.oauth-success {
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #86efac;
}

.error-icon,
.success-icon {
  font-size: 1rem;
  filter: drop-shadow(0 0 6px currentColor);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .oauth-buttons {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .oauth-button {
    padding: 0.65rem 0.4rem;
    min-height: 44px;
  }
  
  .oauth-text {
    font-size: 0.7rem;
  }
  
  .divider-text {
    font-size: 0.8rem;
    margin: 0 0.75rem;
  }
}

@media (max-width: 360px) {
  .oauth-buttons {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.4rem;
  }
  
  .oauth-button {
    padding: 0.6rem 0.3rem;
    min-height: 40px;
  }
  
  .oauth-text {
    font-size: 0.65rem;
  }
}

/* 特定提供商的颜色定制 */
.oauth-button[style*="--provider-color: #4285f4"] {
  /* Google */
  --provider-glow: rgba(66, 133, 244, 0.3);
}

.oauth-button[style*="--provider-color: #333333"] {
  /* GitHub */
  --provider-glow: rgba(51, 51, 51, 0.3);
}

.oauth-button[style*="--provider-color: #00d4aa"] {
  /* Feishu */
  --provider-glow: rgba(0, 212, 170, 0.3);
}

.oauth-button[style*="--provider-color: #1890ff"] {
  /* DingTalk */
  --provider-glow: rgba(24, 144, 255, 0.3);
}

.oauth-button[style*="--provider-color: #07c160"] {
  /* WeChat */
  --provider-glow: rgba(7, 193, 96, 0.3);
}
</style>