<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import ParticleNetwork from '../components/ParticleNetwork.vue'
import OAuthButtons from '../components/OAuthButtons.vue'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('dukuan')
const password = ref('Q_Q727585266')
const showPassword = ref(false)

const handleLogin = async () => {
  const success = await authStore.login(username.value, password.value)
  
  if (success) {
    router.push('/')
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

onMounted(() => {
  // If already authenticated, redirect to dashboard
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center relative p-4">
    <!-- 动态粒子网络背景 -->
    <ParticleNetwork />
    
    <!-- 登录内容层 -->
    <div class="login-card w-full max-w-sm">
      <!-- 简化的标题 -->
      <div class="simple-header">
        <h1 class="platform-title">K8s多集群管理平台</h1>
      </div>

      <!-- 简化的表单 -->
      <form @submit.prevent="handleLogin" class="simple-form">
        <!-- 用户名输入框 -->
        <div class="simple-input-group">
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              placeholder="请输入用户名"
              :disabled="authStore.loading"
              class="simple-input"
            />
          </div>
        </div>

        <!-- 密码输入框 -->
        <div class="simple-input-group">
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="请输入密码"
              :disabled="authStore.loading"
              class="simple-input password-input"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              :disabled="authStore.loading"
              class="simple-password-toggle"
            >
              <span v-if="showPassword">👁️</span>
              <span v-else>👀</span>
            </button>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="authStore.error" class="simple-error">
          {{ authStore.error }}
        </div>

        <!-- 登录按钮 -->
        <button
          type="submit"
          :disabled="authStore.loading"
          class="simple-login-btn"
        >
          <span v-if="authStore.loading">登录中...</span>
          <span v-else>登录</span>
        </button>

        <!-- OAuth 第三方登录 -->
        <OAuthButtons 
          :loading="authStore.loading" 
          :mockMode="true"
        />
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 简化的主卡片样式 */
.login-card {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 8px;
  padding: 3rem 2.5rem;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.2),
    0 0 50px rgba(0, 0, 0, 0.1);
  animation: cardFloat 6s ease-in-out infinite alternate;
}

@keyframes cardFloat {
  0% {
    transform: translateY(0px);
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.2),
      0 0 50px rgba(0, 0, 0, 0.1);
  }
  100% {
    transform: translateY(-8px);
    box-shadow: 
      0 15px 40px rgba(0, 0, 0, 0.25),
      0 0 60px rgba(0, 0, 0, 0.15);
  }
}

/* 简化的标题 */
.simple-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.platform-title {
  font-size: 1.5rem;
  font-weight: 400;
  color: #4a5568;
  margin: 0;
  letter-spacing: 0.05em;
}

/* 简化的表单 */
.simple-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 输入框组 */
.simple-input-group {
  margin-bottom: 0;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(247, 250, 252, 0.8);
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  background: rgba(255, 255, 255, 0.95);
}

.input-icon {
  padding: 0 1rem;
  color: #a0aec0;
  font-size: 1.1rem;
  user-select: none;
}

.simple-input {
  flex: 1;
  padding: 1rem 1rem 1rem 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.95rem;
  color: #2d3748;
  width: 100%;
}

.simple-input::placeholder {
  color: #a0aec0;
  font-size: 0.9rem;
}

.simple-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 密码显示切换按钮 */
.simple-password-toggle {
  padding: 0 1rem;
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  font-size: 1.1rem;
  transition: color 0.2s ease;
}

.simple-password-toggle:hover {
  color: #4299e1;
}

.simple-password-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 错误提示 */
.simple-error {
  color: #e53e3e;
  font-size: 0.875rem;
  text-align: center;
  padding: 0.75rem;
  background: rgba(254, 226, 226, 0.8);
  border: 1px solid rgba(252, 165, 165, 0.5);
  border-radius: 4px;
  margin: -0.5rem 0 0.5rem 0;
}

/* 登录按钮 */
.simple-login-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.025em;
}

.simple-login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

.simple-login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.simple-login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
    margin: 1rem;
    border-radius: 6px;
    animation: none;
    transform: none !important;
  }
  
  .platform-title {
    font-size: 1.25rem;
  }
  
  .simple-form {
    gap: 1.25rem;
  }
}

/* 悬停效果优化 */
@media (hover: hover) {
  .login-card:hover {
    animation-play-state: paused;
    transform: translateY(-12px) !important;
  }
}
</style>