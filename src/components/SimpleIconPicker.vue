<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  Home, Settings, Users, Folder, File, Search, Plus, Edit, Trash, Download, Save,
  Menu, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, X, Check, Info, AlertTriangle, Bell,
  Server, Database, Monitor, Cpu, HardDrive, Wifi, Shield, Lock, Unlock, Key
} from 'lucide-vue-next'
import IconRenderer from './IconRenderer.vue'

interface Props {
  modelValue: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showLabel: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPicker = ref(false)
const searchQuery = ref('')
const activeTab = ref<'emoji' | 'lucide' | 'company' | 'bootstrap'>('emoji')

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const lucideIconsMap = {
  Home, Settings, Users, Folder, File, Search, Plus, Edit, Trash, Download, Save,
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
      { name: 'Download', component: 'Download' },
      { name: 'Save', component: 'Save' }
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

// 公司 Logo 配置
const companyLogos = {
  'social': {
    name: '社交媒体',
    icons: [
      { name: '微信', component: 'wechat' },
      { name: 'Facebook', component: 'facebook' },
      { name: 'Twitter/X', component: 'x' },
      { name: 'LinkedIn', component: 'linkedin' },
      { name: 'Instagram', component: 'instagram' },
      { name: 'YouTube', component: 'youtube' },
      { name: 'TikTok', component: 'tiktok' }
    ]
  },
  'tech': {
    name: '科技公司',
    icons: [
      { name: 'GitHub', component: 'github' },
      { name: 'Google', component: 'google' },
      { name: 'Microsoft', component: 'microsoft' },
      { name: 'Apple', component: 'apple' }
    ]
  },
  'communication': {
    name: '通讯工具',
    icons: [
      { name: '飞书', component: 'feishu' },
      { name: 'Slack', component: 'slack' },
      { name: 'Discord', component: 'discord' },
      { name: 'Telegram', component: 'telegram' }
    ]
  }
}

// Bootstrap Icons 分类
const bootstrapIcons = {
  'common': {
    name: '常用',
    icons: [
      'house', 'gear', 'person', 'folder', 'file-text', 'search', 'plus', 
      'pencil', 'trash', 'download', 'upload', 'save', 'check', 'x', 
      'info-circle', 'exclamation-triangle', 'bell'
    ]
  },
  'interface': {
    name: '界面',
    icons: [
      'menu-app', 'grid', 'list', 'table', 'kanban', 'layout-sidebar',
      'layout-three-columns', 'window', 'fullscreen', 'fullscreen-exit',
      'arrows-fullscreen', 'arrows-collapse'
    ]
  },
  'navigation': {
    name: '导航',
    icons: [
      'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down', 
      'chevron-left', 'chevron-right', 'chevron-up', 'chevron-down',
      'caret-left', 'caret-right', 'caret-up', 'caret-down'
    ]
  },
  'communication': {
    name: '通讯',
    icons: [
      'chat', 'chat-dots', 'envelope', 'telephone', 'phone', 
      'chat-left-text', 'chat-right-text', 'send', 'reply', 
      'forward', 'share'
    ]
  },
  'media': {
    name: '媒体',
    icons: [
      'play', 'pause', 'stop', 'skip-backward', 'skip-forward',
      'volume-up', 'volume-down', 'volume-mute', 'camera', 'image',
      'film', 'music-note'
    ]
  },
  'system': {
    name: '系统',
    icons: [
      'cpu', 'memory', 'hdd', 'server', 'database', 'cloud', 
      'shield', 'lock', 'unlock', 'key', 'wifi', 'ethernet',
      'router', 'modem'
    ]
  },
  'business': {
    name: '商务',
    icons: [
      'briefcase', 'building', 'shop', 'cart', 'credit-card',
      'currency-dollar', 'graph-up', 'graph-down', 'pie-chart',
      'bar-chart', 'clipboard-data'
    ]
  },
  'tools': {
    name: '工具',
    icons: [
      'tools', 'hammer', 'wrench', 'screwdriver', 'rulers',
      'scissors', 'brush', 'paint-bucket', 'eyedropper',
      'magic', 'bug'
    ]
  }
}

const buttonSize = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-8 h-8'
    case 'md': return 'w-10 h-10'
    case 'lg': return 'w-12 h-12'
    default: return 'w-10 h-10'
  }
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm': return 'sm'
    case 'md': return 'md'
    case 'lg': return 'lg'
    default: return 'md'
  }
})

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
  } else if (activeTab.value === 'lucide') {
    if (!searchQuery.value) return lucideIcons
    
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
  } else if (activeTab.value === 'company') {
    // company logos
    if (!searchQuery.value) return companyLogos
    
    const filtered: Record<string, any> = {}
    Object.entries(companyLogos).forEach(([key, category]) => {
      const filteredIcons = category.icons.filter(icon => 
        icon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
      if (filteredIcons.length > 0) {
        filtered[key] = { ...category, icons: filteredIcons }
      }
    })
    return filtered
  } else {
    // bootstrap icons
    if (!searchQuery.value) return bootstrapIcons
    
    const filtered: Record<string, any> = {}
    Object.entries(bootstrapIcons).forEach(([key, category]) => {
      const filteredIcons = category.icons.filter(icon => 
        icon.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
      if (filteredIcons.length > 0) {
        filtered[key] = { ...category, icons: filteredIcons }
      }
    })
    return filtered
  }
})

const selectIcon = (event: Event, icon: string | { name: string, component: string }) => {
  // 阻止事件冒泡，防止触发其他点击事件
  event.stopPropagation()
  event.preventDefault()
  
  let value: string
  if (typeof icon === 'string') {
    if (activeTab.value === 'bootstrap') {
      value = `bi:${icon}`
    } else {
      value = icon
    }
  } else {
    if (activeTab.value === 'lucide') {
      value = `lucide:${icon.component}`
    } else if (activeTab.value === 'company') {
      value = `company:${icon.component}`
    } else {
      value = icon.component
    }
  }
  
  emit('update:modelValue', value)
  showPicker.value = false
  searchQuery.value = ''
}

const openPicker = (event: Event) => {
  event.stopPropagation()
  event.preventDefault()
  showPicker.value = true
}

const closePicker = (event?: Event) => {
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }
  showPicker.value = false
  searchQuery.value = ''
}

// 使用一个ref来存储容器元素
const pickerRef = ref<HTMLElement>()

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  if (!pickerRef.value) return
  
  const target = event.target as HTMLElement
  // 如果点击的目标不在picker容器内，则关闭
  if (!pickerRef.value.contains(target) && showPicker.value) {
    closePicker()
  }
}

// 使用Vue生命周期钩子来管理事件监听器
onMounted(() => {
  // 使用捕获阶段来确保我们的处理器先执行
  document.addEventListener('mousedown', handleClickOutside, true)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside, true)
})

// 获取标签友好文本
const getLabelText = (iconValue: string): string => {
  if (!iconValue) return ''
  
  if (iconValue.startsWith('lucide:')) {
    const iconName = iconValue.replace('lucide:', '')
    // 查找对应的图标配置获取友好名称
    for (const category of Object.values(lucideIcons)) {
      const found = category.icons.find(icon => icon.component === iconName)
      if (found) return found.name
    }
    return iconName
  }
  
  if (iconValue.startsWith('company:')) {
    const companyName = iconValue.replace('company:', '')
    // 查找对应的公司logo配置获取友好名称
    for (const category of Object.values(companyLogos)) {
      const found = category.icons.find(icon => icon.component === companyName)
      if (found) return found.name
    }
    return companyName
  }
  
  if (iconValue.startsWith('ant-design:')) {
    return iconValue.replace('ant-design:', '').replace(/-/g, ' ')
  }
  
  if (iconValue.startsWith('oauth:')) {
    return iconValue.replace('oauth:', '') + ' OAuth'
  }
  
  return iconValue
}
</script>

<template>
  <div ref="pickerRef" class="simple-icon-picker-container relative">
    <!-- 图标按钮 -->
    <div class="flex items-center space-x-2">
      <button
        :class="[
          buttonSize,
          'border-2 border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-kubernetes-500 transition-colors bg-white'
        ]"
        @click="openPicker($event)"
        type="button"
      >
        <IconRenderer 
          v-if="modelValue" 
          :icon="modelValue" 
          :size="iconSize"
          class="text-lg"
        />
        <Plus v-else class="w-4 h-4 text-gray-400" />
      </button>
      <span v-if="showLabel && modelValue" class="text-sm text-gray-600">{{ getLabelText(modelValue) }}</span>
    </div>

    <!-- 图标选择器面板 -->
    <div 
      v-if="showPicker"
      class="simple-icon-picker-dropdown absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
    >
      <!-- 头部 -->
      <div class="p-3 border-b border-gray-200">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-medium text-gray-900 text-sm">选择图标</h3>
          <button @click="closePicker($event)" class="text-gray-400 hover:text-gray-600" type="button">
            <X class="w-4 h-4" />
          </button>
        </div>
        
        <!-- 搜索 -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索图标..."
          class="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-kubernetes-500"
        />
        
        <!-- 标签页 -->
        <div class="flex space-x-1 mt-2">
          <button
            @click.stop="activeTab = 'emoji'"
            class="px-2 py-1 text-xs rounded transition-colors"
            :class="activeTab === 'emoji' 
              ? 'bg-kubernetes-100 text-kubernetes-700' 
              : 'text-gray-600 hover:text-gray-900'"
            type="button"
          >
            Emoji
          </button>
          <button
            @click.stop="activeTab = 'lucide'"
            class="px-2 py-1 text-xs rounded transition-colors"
            :class="activeTab === 'lucide' 
              ? 'bg-kubernetes-100 text-kubernetes-700' 
              : 'text-gray-600 hover:text-gray-900'"
            type="button"
          >
            图标
          </button>
          <button
            @click.stop="activeTab = 'company'"
            class="px-2 py-1 text-xs rounded transition-colors"
            :class="activeTab === 'company' 
              ? 'bg-kubernetes-100 text-kubernetes-700' 
              : 'text-gray-600 hover:text-gray-900'"
            type="button"
          >
            品牌
          </button>
          <button
            @click.stop="activeTab = 'bootstrap'"
            class="px-2 py-1 text-xs rounded transition-colors"
            :class="activeTab === 'bootstrap' 
              ? 'bg-kubernetes-100 text-kubernetes-700' 
              : 'text-gray-600 hover:text-gray-900'"
            type="button"
          >
            Bootstrap
          </button>
        </div>
      </div>

      <!-- 图标内容 -->
      <div class="p-3 max-h-60 overflow-y-auto">
        <div v-if="Object.keys(currentIcons).length === 0" class="text-center text-gray-500 py-6">
          <p class="text-xs">没有找到匹配的图标</p>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="(category, categoryKey) in currentIcons" 
            :key="categoryKey"
          >
            <h4 class="text-xs font-medium text-gray-700 mb-1.5">{{ (category as any).name }}</h4>
            
            <!-- Emoji 图标 -->
            <div v-if="activeTab === 'emoji'" class="grid grid-cols-8 gap-1">
              <button
                v-for="icon in (category as any).icons"
                :key="icon"
                @click="selectIcon($event, icon)"
                class="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                :title="icon"
                type="button"
              >
                <span class="text-sm">{{ icon }}</span>
              </button>
            </div>
            
            <!-- Lucide 图标 -->
            <div v-else-if="activeTab === 'lucide'" class="grid grid-cols-6 gap-1">
              <button
                v-for="icon in (category as any).icons"
                :key="icon.component"
                @click="selectIcon($event, icon)"
                class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                :title="icon.name"
                type="button"
              >
                <IconRenderer 
                  :icon="`lucide:${icon.component}`"
                  size="sm"
                  class="text-gray-700"
                />
              </button>
            </div>
            
            <!-- 公司 Logo -->
            <div v-else-if="activeTab === 'company'" class="grid grid-cols-6 gap-1">
              <button
                v-for="icon in (category as any).icons"
                :key="icon.component"
                @click="selectIcon($event, icon)"
                class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                :title="icon.name"
                type="button"
              >
                <IconRenderer 
                  :icon="`company:${icon.component}`"
                  size="sm"
                  class="text-gray-700"
                />
              </button>
            </div>
            
            <!-- Bootstrap 图标 -->
            <div v-else class="grid grid-cols-8 gap-1">
              <button
                v-for="icon in (category as any).icons"
                :key="icon"
                @click="selectIcon($event, icon)"
                class="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                :title="icon"
                type="button"
              >
                <IconRenderer 
                  :icon="`bi:${icon}`"
                  size="sm"
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
.simple-icon-picker-container {
  position: relative;
}

/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

/* 图标悬浮效果 */
button:hover {
  transform: scale(1.05);
}
</style>