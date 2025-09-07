<script setup lang="ts">
import { ref, computed, defineEmits, defineProps, onMounted, onUnmounted } from 'vue'
import { 
  Home, Settings, Users, Folder, File, Search, Plus, Edit, Trash, Download,
  Menu, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, X, Check, Info, AlertTriangle, Bell,
  Server, Database, Monitor, Cpu, HardDrive, Wifi, Shield, Lock, Unlock, Key
} from 'lucide-vue-next'
import IconRenderer from './IconRenderer.vue'

interface Props {
  modelValue: string
  placeholder?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPicker = ref(false)
const searchQuery = ref('')
const activeTab = ref<'emoji' | 'lucide'>('emoji')

// Emoji 图标分类
const emojiCategories = {
  'common': {
    name: '常用',
    icons: ['🏠', '📊', '⚙️', '👥', '📁', '🔧', '💻', '📋', '🎯', '🚀', '💾', '🌐', '🔒', '📈', '🛠️']
  },
  'kubernetes': {
    name: 'Kubernetes',
    icons: ['🏢', '📦', '🐳', '🔗', '💽', '🔄', '🖥️', '⏰', '👹', '🌍', '📢', '📜', '🚨', '💻', '📝']
  },
  'system': {
    name: '系统',
    icons: ['⚙️', '🔧', '👥', '🎭', '📋', '🏗️', '🔐', '📊', '💡', '🔍', '⚡', '🎯', '📱', '💼', '🏆']
  },
  'interface': {
    name: '界面',
    icons: ['📁', '📂', '🗂️', '📄', '📃', '📑', '🗃️', '🗄️', '📇', '🗳️', '🏷️', '🎨', '🖼️', '📐', '📏']
  },
  'action': {
    name: '操作',
    icons: ['➕', '➖', '✏️', '🗑️', '📤', '📥', '🔄', '🔀', '🔁', '⏸️', '▶️', '⏹️', '⏯️', '🔊', '🔉']
  },
  'status': {
    name: '状态',
    icons: ['✅', '❌', '⚠️', '💚', '💛', '❤️', '🔴', '🟢', '🟡', '⭐', '🌟', '💎', '🏅', '🎖️', '🏵️']
  }
}

// Lucide 图标映射
const lucideIconsMap: Record<string, any> = {
  Home, Settings, Users, Folder, File, Search, Plus, Edit, Trash, Download,
  Menu, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, X, Check, Info, AlertTriangle, Bell,
  Server, Database, Monitor, Cpu, HardDrive, Wifi, Shield, Lock, Unlock, Key
}

// Lucide 图标配置
const lucideIcons = {
  'common': {
    name: '常用',
    icons: [
      { name: 'Home', component: 'Home' },
      { name: 'Settings', component: 'Settings' },
      { name: 'Users', component: 'Users' },
      { name: 'Folder', component: 'Folder' },
      { name: 'File', component: 'File' },
      { name: 'Search', component: 'Search' },
      { name: 'Plus', component: 'Plus' },
      { name: 'Edit', component: 'Edit' },
      { name: 'Trash', component: 'Trash' },
      { name: 'Download', component: 'Download' }
    ]
  },
  'navigation': {
    name: '导航',
    icons: [
      { name: 'Menu', component: 'Menu' },
      { name: 'ArrowLeft', component: 'ArrowLeft' },
      { name: 'ArrowRight', component: 'ArrowRight' },
      { name: 'ChevronDown', component: 'ChevronDown' },
      { name: 'ChevronUp', component: 'ChevronUp' },
      { name: 'X', component: 'X' },
      { name: 'Check', component: 'Check' },
      { name: 'Info', component: 'Info' },
      { name: 'AlertTriangle', component: 'AlertTriangle' },
      { name: 'Bell', component: 'Bell' }
    ]
  },
  'system': {
    name: '系统',
    icons: [
      { name: 'Server', component: 'Server' },
      { name: 'Database', component: 'Database' },
      { name: 'Monitor', component: 'Monitor' },
      { name: 'Cpu', component: 'Cpu' },
      { name: 'HardDrive', component: 'HardDrive' },
      { name: 'Wifi', component: 'Wifi' },
      { name: 'Shield', component: 'Shield' },
      { name: 'Lock', component: 'Lock' },
      { name: 'Unlock', component: 'Unlock' },
      { name: 'Key', component: 'Key' }
    ]
  }
}

const currentIcons = computed(() => {
  if (activeTab.value === 'emoji') {
    if (!searchQuery.value) return emojiCategories
    
    const filtered: Record<string, any> = {}
    Object.entries(emojiCategories).forEach(([key, category]) => {
      const filteredIcons = category.icons.filter(icon => 
        icon.includes(searchQuery.value)
      )
      if (filteredIcons.length > 0) {
        filtered[key] = { ...category, icons: filteredIcons }
      }
    })
    return filtered
  } else {
    if (!searchQuery.value) {
      // 调试：检查lucideIconsMap中的组件
      console.log('lucideIconsMap:', Object.keys(lucideIconsMap))
      console.log('lucideIcons:', lucideIcons)
      return lucideIcons
    }
    
    const filtered: Record<string, any> = {}
    Object.entries(lucideIcons).forEach(([key, category]) => {
      const filteredIcons = category.icons.filter(icon => 
        icon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
      if (filteredIcons.length > 0) {
        filtered[key] = { ...category, icons: filteredIcons }
      }
    })
    return filtered
  }
})

const selectIcon = (event: Event, icon: string | { name: string, component: string }) => {
  // 阻止事件冒泡和默认行为
  event.stopPropagation()
  event.preventDefault()
  
  const value = typeof icon === 'string' ? icon : `lucide:${icon.component}`
  emit('update:modelValue', value)
  showPicker.value = false
  searchQuery.value = ''
}

const openPicker = () => {
  showPicker.value = true
}

const closePicker = () => {
  showPicker.value = false
  searchQuery.value = ''
}

// 点击外部关闭
const handleClickOutside = (event: Event) => {
  // 添加小延迟以避免与图标选择事件冲突
  setTimeout(() => {
    const target = event.target as Element
    // 检查点击是否在图标选择器容器外部
    if (!target.closest('.icon-picker-container') && showPicker.value) {
      closePicker()
    }
  }, 10)
}

// 组件挂载时添加事件监听器
onMounted(() => {
  if (typeof window !== 'undefined') {
    document.addEventListener('click', handleClickOutside)
  }
})

// 组件卸载时清理事件监听器
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<template>
  <div class="icon-picker-container relative">
    <!-- 输入框 -->
    <div class="flex items-center space-x-2">
      <div 
        class="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-kubernetes-500 transition-colors"
        @click="openPicker"
      >
        <IconRenderer 
          v-if="modelValue" 
          :icon="modelValue" 
          size="md"
          class="text-lg"
        />
        <span v-else class="text-gray-400 text-sm">选择</span>
      </div>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        type="text"
        :placeholder="placeholder || '输入图标或点击选择'"
        class="input-field flex-1"
      />
    </div>

    <!-- 图标选择器面板 -->
    <div 
      v-if="showPicker"
      class="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
    >
      <!-- 头部 -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-medium text-gray-900">选择图标</h3>
          <button @click="closePicker" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <!-- 搜索 -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索图标..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kubernetes-500"
        />
        
        <!-- 标签页 -->
        <div class="flex space-x-1 mt-3">
          <button
            @click="activeTab = 'emoji'"
            class="px-3 py-1 text-sm rounded transition-colors"
            :class="activeTab === 'emoji' 
              ? 'bg-kubernetes-100 text-kubernetes-700' 
              : 'text-gray-600 hover:text-gray-900'"
          >
            Emoji
          </button>
          <button
            @click="activeTab = 'lucide'"
            class="px-3 py-1 text-sm rounded transition-colors"
            :class="activeTab === 'lucide' 
              ? 'bg-kubernetes-100 text-kubernetes-700' 
              : 'text-gray-600 hover:text-gray-900'"
          >
            图标
          </button>
        </div>
      </div>

      <!-- 图标内容 -->
      <div class="p-4 max-h-64 overflow-y-auto">
        <div v-if="Object.keys(currentIcons).length === 0" class="text-center text-gray-500 py-8">
          <p>没有找到匹配的图标</p>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="(category, categoryKey) in currentIcons" 
            :key="categoryKey"
          >
            <h4 class="text-sm font-medium text-gray-700 mb-2">{{ category.name }}</h4>
            
            <!-- Emoji 图标 -->
            <div v-if="activeTab === 'emoji'" class="grid grid-cols-8 gap-2">
              <button
                v-for="icon in category.icons"
                :key="icon"
                @click="selectIcon($event, icon)"
                class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                :title="icon"
              >
                <span class="text-lg">{{ icon }}</span>
              </button>
            </div>
            
            <!-- Lucide 图标 -->
            <div v-else class="grid grid-cols-6 gap-2">
              <button
                v-for="icon in category.icons"
                :key="icon.component"
                @click="selectIcon($event, icon)"
                class="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                :title="icon.name"
              >
                <IconRenderer 
                  :icon="`lucide:${icon.component}`"
                  size="md"
                  class="text-gray-700"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-picker-container {
  position: relative;
}

/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

/* 图标悬浮效果 */
button:hover {
  transform: scale(1.1);
}
</style>