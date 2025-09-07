<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { menuService } from '../services/menuService'
import { useAuthStore } from '../stores/auth'
import IconRenderer from './IconRenderer.vue'

const route = useRoute()
const authStore = useAuthStore()
const expandedGroups = ref<Set<string>>(new Set())

// 根据当前路由自动展开相关的菜单分组
const autoExpandGroups = () => {
  const menus = menuService.allMenus.value
  const currentPath = route.path
  
  console.log('Auto expanding groups for path:', currentPath)
  
  // 清除所有展开的分组
  expandedGroups.value.clear()
  
  // 只展开包含当前路径的菜单分组
  for (const group of menus) {
    const hasMatchingChild = group.children.some(child => {
      return child.path === currentPath || 
             (child.path && currentPath.startsWith(child.path))
    })
    if (hasMatchingChild) {
      expandedGroups.value.add(group.id)
      console.log('Expanding group:', group.id, 'for path:', currentPath)
    }
  }
}

// 切换分组展开/折叠状态
const toggleGroup = (groupId: string) => {
  if (expandedGroups.value.has(groupId)) {
    expandedGroups.value.delete(groupId)
  } else {
    expandedGroups.value.add(groupId)
  }
}

// 检查菜单项是否激活
const isActive = (path?: string): boolean => {
  if (!path) return false
  return route.path === path
}

// 检查分组是否包含激活项
const hasActiveChild = (children: any[]): boolean => {
  if (!children) return false
  return children.some(child => child.path === route.path)
}

// 获取用户权限过滤后的菜单
const filteredMenus = computed(() => {
  const userRoles = authStore.user?.roles || []
  // 这里可以根据角色映射权限，简化示例直接返回所有菜单
  return menuService.allMenus.value
})

// Logo点击返回首页
const logoClick = () => {
  // 可以添加特殊逻辑，比如显示版本信息等
}

onMounted(async () => {
  // 确保菜单数据已加载
  await menuService.refreshMenus()
  // 根据当前路径自动展开菜单组
  autoExpandGroups()
})

// 监听路由变化，自动展开相关菜单分组
watch(() => route.path, () => {
  autoExpandGroups()
}, { immediate: false })
</script>

<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
    <!-- Logo区域 -->
    <div class="flex items-center px-4 py-3 border-b border-gray-200">
      <div @click="logoClick" class="cursor-pointer flex items-center space-x-2">
        <div class="w-6 h-6 bg-kubernetes-500 rounded-md flex items-center justify-center">
          <span class="text-white font-bold text-xs">K</span>
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-gray-900 text-xs">KRM</span>
          <span class="text-xs text-gray-500">Resource Manager</span>
        </div>
      </div>
    </div>

    <!-- 导航菜单 -->
    <nav class="flex-1 overflow-y-auto px-3 py-3">
      <div class="space-y-1">
        <div
          v-for="group in filteredMenus"
          :key="group.id"
          class="mb-1.5"
        >
          <!-- 分组标题 -->
          <button
            @click="toggleGroup(group.id)"
            class="w-full flex items-center justify-between px-2 py-1.5 text-left rounded-md transition-colors duration-200 group"
            :class="[
              hasActiveChild(group.children) 
                ? 'bg-kubernetes-50 text-kubernetes-700' 
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            <div class="flex items-center space-x-2">
              <IconRenderer :icon="group.icon" size="sm" class="text-xs" />
              <span class="font-medium text-xs">{{ group.title }}</span>
            </div>
            <svg 
              class="w-3 h-3 transition-transform duration-200"
              :class="{ 'rotate-180': expandedGroups.has(group.id) }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- 子菜单项 -->
          <div 
            v-show="expandedGroups.has(group.id)"
            class="ml-4 mt-1 space-y-0.5"
          >
            <RouterLink
              v-for="item in group.children"
              :key="item.id"
              :to="item.path || '#'"
              class="flex items-center justify-between px-2 py-1 rounded-md transition-all duration-200 group"
              :class="[
                isActive(item.path)
                  ? 'bg-kubernetes-100 text-kubernetes-800 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
              :title="item.description"
            >
              <div class="flex items-center space-x-2">
                <IconRenderer :icon="item.icon" size="sm" class="text-xs" />
                <span class="text-xs font-medium">{{ item.title }}</span>
              </div>
              
              <!-- 徽章 -->
              <span 
                v-if="item.badge"
                class="px-2 py-1 text-xs font-semibold rounded-full"
                :class="[
                  item.badge === 'Hot' 
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                ]"
              >
                {{ item.badge }}
              </span>
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- 底部信息 -->
    <div class="border-t border-gray-200 px-3 py-2">
      <div class="text-xs text-gray-500 text-center">
        <div class="font-medium">KubeEasy v2.0</div>
        <div class="mt-0.5 text-xs">Made Simple</div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* 自定义滚动条样式 */
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

/* RouterLink活跃状态的特殊样式 */
.router-link-active {
  position: relative;
}

.router-link-active::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 16px;
  background: linear-gradient(135deg, #326ce5 0%, #1e3a8a 100%);
  border-radius: 2px;
}

/* 悬浮动画效果 */
.group:hover {
  transform: translateY(-1px);
}

/* 图标动画 */
.group:hover .text-lg,
.group:hover .text-sm:first-of-type {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* 激活状态的特殊动画 */
@keyframes pulse-blue {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(50, 108, 229, 0.4);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(50, 108, 229, 0.1);
  }
}

.router-link-active {
  animation: pulse-blue 2s infinite;
}
</style>