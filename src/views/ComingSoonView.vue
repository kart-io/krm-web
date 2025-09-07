<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const title = route.meta.title || '功能开发中'
</script>

<template>
  <div class="flex items-center justify-center min-h-96">
    <div class="text-center">
      <div class="text-8xl mb-6">🚧</div>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ title }}</h2>
      <p class="text-gray-600 mb-6">该功能正在开发中，敬请期待!</p>
      <div class="space-y-2 text-sm text-gray-500">
        <p>🔨 正在努力构建中...</p>
        <p>📅 预计很快上线</p>
        <p>💡 如有建议，欢迎反馈</p>
      </div>
      <div class="mt-8">
        <router-link to="/" class="btn-primary">返回首页</router-link>
      </div>
    </div>
  </div>
</template>