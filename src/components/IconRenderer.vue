<script setup lang="ts">
import { computed } from 'vue'
import { 
  Home, Settings, Users, Folder, File, Search, Plus, Edit, Trash, Download, Save,
  Menu, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, X, Check, Info, AlertTriangle, Bell,
  Server, Database, Monitor, Cpu, HardDrive, Wifi, Shield, Lock, Unlock, Key
} from 'lucide-vue-next'
import {
  MenuFoldOutlined, MenuUnfoldOutlined, ReloadOutlined, FullscreenOutlined, FullscreenExitOutlined,
  UserOutlined, SettingOutlined, LogoutOutlined, DownOutlined
} from '@ant-design/icons-vue'
import OAuthIcons from './icons/OAuthIcons.vue'
import CompanyLogos from './icons/CompanyLogos.vue'
import BootstrapIcons from './icons/BootstrapIcons.vue'

interface Props {
  icon: string
  size?: 'sm' | 'md' | 'lg'
  class?: string
}

const props = defineProps<Props>()

// Lucide 图标映射
const lucideIconsMap: Record<string, any> = {
  Home, Settings, Users, Folder, File, Search, Plus, Edit, Trash, Download, Save,
  Menu, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, X, Check, Info, AlertTriangle, Bell,
  Server, Database, Monitor, Cpu, HardDrive, Wifi, Shield, Lock, Unlock, Key
}

// Ant Design 图标映射
const antdIconsMap: Record<string, any> = {
  'menu-fold-outlined': MenuFoldOutlined,
  'menu-unfold-outlined': MenuUnfoldOutlined,
  'reload-outlined': ReloadOutlined,
  'fullscreen-outlined': FullscreenOutlined,
  'fullscreen-exit-outlined': FullscreenExitOutlined,
  'user-outlined': UserOutlined,
  'setting-outlined': SettingOutlined,
  'logout-outlined': LogoutOutlined,
  'down-outlined': DownOutlined
}

// 尺寸映射
const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5', 
  lg: 'w-6 h-6'
}

// 判断图标类型和获取组件
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const iconInfo = computed(() => {
  if (!props.icon) return { type: 'none' }
  
  console.log('IconRenderer processing icon:', props.icon)
  
  // 检查是否是公司logo图标
  if (props.icon.startsWith('company:')) {
    const company = props.icon.replace('company:', '')
    return { 
      type: 'company', 
      company,
      class: `${sizeClasses[props.size || 'md']} ${props.class || ''}`
    }
  }
  
  // 检查是否是OAuth图标
  if (props.icon.startsWith('oauth:')) {
    const provider = props.icon.replace('oauth:', '')
    // 将CSS尺寸转换为数字像素
    const sizeMap = { sm: 16, md: 20, lg: 24 }
    const pixelSize = sizeMap[props.size || 'md']
    return { 
      type: 'oauth', 
      provider,
      size: pixelSize,
      class: `${sizeClasses[props.size || 'md']} ${props.class || ''}`
    }
  }
  
  // 检查是否是Bootstrap图标
  if (props.icon.startsWith('bootstrap:') || props.icon.startsWith('bi:')) {
    const iconName = props.icon.replace(/^(bootstrap:|bi:)/, '')
    // 将CSS尺寸转换为数字像素
    const sizeMap = { sm: 16, md: 20, lg: 24 }
    const pixelSize = sizeMap[props.size || 'md']
    return { 
      type: 'bootstrap', 
      name: iconName,
      size: pixelSize,
      class: `${sizeClasses[props.size || 'md']} ${props.class || ''}`
    }
  }
  
  // 检查是否是ant-design图标
  if (props.icon.startsWith('ant-design:')) {
    const iconName = props.icon.replace('ant-design:', '')
    const component = antdIconsMap[iconName]
    if (component) {
      return { 
        type: 'antd', 
        component,
        class: `${sizeClasses[props.size || 'md']} ${props.class || ''}`
      }
    }
  }
  
  // 检查是否是lucide图标
  if (props.icon.startsWith('lucide:')) {
    const componentName = props.icon.replace('lucide:', '')
    const component = lucideIconsMap[componentName]
    console.log('Lucide icon lookup:', componentName, 'found:', !!component, 'available keys:', Object.keys(lucideIconsMap))
    if (component) {
      console.log('Returning lucide type for:', componentName)
      return { 
        type: 'lucide', 
        component,
        class: `${sizeClasses[props.size || 'md']} ${props.class || ''}`
      }
    }
  }
  
  // 默认作为emoji或文本处理
  console.log('Falling back to emoji/text for:', props.icon)
  return { 
    type: 'emoji', 
    content: props.icon 
  }
})
</script>

<template>
  
  <!-- 直接渲染lucide图标 -->
  <Home v-if="props.icon === 'lucide:Home'" class="w-5 h-5" />
  <Settings v-else-if="props.icon === 'lucide:Settings'" class="w-5 h-5" />
  <Users v-else-if="props.icon === 'lucide:Users'" class="w-5 h-5" />
  <Folder v-else-if="props.icon === 'lucide:Folder'" class="w-5 h-5" />
  <File v-else-if="props.icon === 'lucide:File'" class="w-5 h-5" />
  <Search v-else-if="props.icon === 'lucide:Search'" class="w-5 h-5" />
  <Plus v-else-if="props.icon === 'lucide:Plus'" class="w-5 h-5" />
  <Edit v-else-if="props.icon === 'lucide:Edit'" class="w-5 h-5" />
  <Trash v-else-if="props.icon === 'lucide:Trash'" class="w-5 h-5" />
  <Download v-else-if="props.icon === 'lucide:Download'" class="w-5 h-5" />
  <Save v-else-if="props.icon === 'lucide:Save'" class="w-5 h-5" />
  <Menu v-else-if="props.icon === 'lucide:Menu'" class="w-5 h-5" />
  <ArrowLeft v-else-if="props.icon === 'lucide:ArrowLeft'" class="w-5 h-5" />
  <ArrowRight v-else-if="props.icon === 'lucide:ArrowRight'" class="w-5 h-5" />
  <ChevronDown v-else-if="props.icon === 'lucide:ChevronDown'" class="w-5 h-5" />
  <ChevronUp v-else-if="props.icon === 'lucide:ChevronUp'" class="w-5 h-5" />
  <X v-else-if="props.icon === 'lucide:X'" class="w-5 h-5" />
  <Check v-else-if="props.icon === 'lucide:Check'" class="w-5 h-5" />
  <Info v-else-if="props.icon === 'lucide:Info'" class="w-5 h-5" />
  <AlertTriangle v-else-if="props.icon === 'lucide:AlertTriangle'" class="w-5 h-5" />
  <Bell v-else-if="props.icon === 'lucide:Bell'" class="w-5 h-5" />
  <Server v-else-if="props.icon === 'lucide:Server'" class="w-5 h-5" />
  <Database v-else-if="props.icon === 'lucide:Database'" class="w-5 h-5" />
  <Monitor v-else-if="props.icon === 'lucide:Monitor'" class="w-5 h-5" />
  <Cpu v-else-if="props.icon === 'lucide:Cpu'" class="w-5 h-5" />
  <HardDrive v-else-if="props.icon === 'lucide:HardDrive'" class="w-5 h-5" />
  <Wifi v-else-if="props.icon === 'lucide:Wifi'" class="w-5 h-5" />
  <Shield v-else-if="props.icon === 'lucide:Shield'" class="w-5 h-5" />
  <Lock v-else-if="props.icon === 'lucide:Lock'" class="w-5 h-5" />
  <Unlock v-else-if="props.icon === 'lucide:Unlock'" class="w-5 h-5" />
  <Key v-else-if="props.icon === 'lucide:Key'" class="w-5 h-5" />
  
  <!-- 公司 Logo -->
  <CompanyLogos 
    v-else-if="props.icon && props.icon.startsWith('company:')"
    :name="props.icon.replace('company:', '')" 
    :class="`${sizeClasses[props.size || 'md']} ${props.class || ''}`"
  />
  
  <!-- OAuth 图标 -->
  <OAuthIcons 
    v-else-if="props.icon && props.icon.startsWith('oauth:')"
    :provider="props.icon.replace('oauth:', '')" 
    :size="props.size === 'sm' ? 16 : props.size === 'lg' ? 24 : 20"
    :class="`${sizeClasses[props.size || 'md']} ${props.class || ''}`"
  />
  
  <!-- Bootstrap 图标 -->
  <BootstrapIcons 
    v-else-if="props.icon && (props.icon.startsWith('bootstrap:') || props.icon.startsWith('bi:'))"
    :name="props.icon.replace(/^(bootstrap:|bi:)/, '')" 
    :size="props.size === 'sm' ? 16 : props.size === 'lg' ? 24 : 20"
    :class="props.class || ''"
  />
  
  <!-- Ant Design 图标 -->
  <MenuFoldOutlined v-else-if="props.icon === 'ant-design:menu-fold-outlined'" class="w-5 h-5" />
  <MenuUnfoldOutlined v-else-if="props.icon === 'ant-design:menu-unfold-outlined'" class="w-5 h-5" />
  <ReloadOutlined v-else-if="props.icon === 'ant-design:reload-outlined'" class="w-5 h-5" />
  <FullscreenOutlined v-else-if="props.icon === 'ant-design:fullscreen-outlined'" class="w-5 h-5" />
  <FullscreenExitOutlined v-else-if="props.icon === 'ant-design:fullscreen-exit-outlined'" class="w-5 h-5" />
  <UserOutlined v-else-if="props.icon === 'ant-design:user-outlined'" class="w-5 h-5" />
  <SettingOutlined v-else-if="props.icon === 'ant-design:setting-outlined'" class="w-5 h-5" />
  <LogoutOutlined v-else-if="props.icon === 'ant-design:logout-outlined'" class="w-5 h-5" />
  <DownOutlined v-else-if="props.icon === 'ant-design:down-outlined'" class="w-5 h-5" />
  
  <!-- 默认 emoji/文本 -->
  <span 
    v-else
    :class="props.class"
    v-html="props.icon"
  ></span>
</template>