<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { menuService } from '../services/menuService'

const route = useRoute()

const breadcrumbs = computed(() => {
  return menuService.getBreadcrumbs(route.path)
})

const pageTitle = computed(() => {
  const current = breadcrumbs.value[breadcrumbs.value.length - 1]
  return current?.title || 'Dashboard'
})
</script>

<template>
  <div class="flex items-center justify-between py-4 px-6 bg-white border-b border-gray-200">
    <div class="flex items-center space-x-4">
      <!-- 页面标题 -->
      <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
      
      <!-- 面包屑导航 -->
      <nav class="flex items-center space-x-2 text-sm" v-if="breadcrumbs.length > 1">
        <div class="text-gray-400">|</div>
        <div class="flex items-center space-x-2">
          <template v-for="(item, index) in breadcrumbs" :key="item.id">
            <!-- 分隔符 -->
            <svg v-if="index > 0" class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            
            <!-- 面包屑项 -->
            <div class="flex items-center space-x-1">
              <span class="text-sm">{{ item.icon }}</span>
              <RouterLink
                v-if="item.path && index < breadcrumbs.length - 1"
                :to="item.path"
                class="text-gray-500 hover:text-kubernetes-600 transition-colors"
              >
                {{ item.title }}
              </RouterLink>
              <span
                v-else
                class="text-gray-900 font-medium"
              >
                {{ item.title }}
              </span>
            </div>
          </template>
        </div>
      </nav>
    </div>

    <!-- 右侧操作区 -->
    <div class="flex items-center space-x-3">
      <!-- 页面描述 -->
      <div 
        v-if="breadcrumbs.length && breadcrumbs[breadcrumbs.length - 1].description"
        class="hidden md:block text-sm text-gray-500"
      >
        {{ breadcrumbs[breadcrumbs.length - 1].description }}
      </div>
      
      <!-- 刷新按钮 -->
      <button
        @click="$router.go(0)"
        class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
        title="刷新页面"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 面包屑链接悬浮效果 */
a:hover {
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* 刷新按钮旋转动画 */
button:active svg {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
</style>