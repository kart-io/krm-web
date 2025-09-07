<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseModal from './BaseModal.vue'
import FormField from '../form/FormField.vue'

interface TabItem {
  key: string
  label: string
  disabled?: boolean
}

interface Props {
  show: boolean
  title?: string
  loading?: boolean
  submitText?: string
  cancelText?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  persistent?: boolean
  position?: 'center' | 'top' | 'bottom'
  
  // Layout variants
  hasHeader?: boolean
  hasTabs?: boolean
  hasFooter?: boolean
  headerColor?: 'blue' | 'gray' | 'white'
  
  // Tab configuration
  tabs?: TabItem[]
  activeTab?: string
  
  // Form configuration
  formInline?: boolean
  
  // Content configuration
  contentPadding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  submitText: '确认',
  cancelText: '取消',
  size: 'lg',
  persistent: false,
  position: 'center',
  loading: false,
  hasHeader: true,
  hasTabs: false,
  hasFooter: true,
  headerColor: 'blue',
  formInline: true,
  contentPadding: true
})

const emit = defineEmits<{
  close: []
  submit: []
  'update:show': [value: boolean]
  'update:activeTab': [value: string]
}>()

const currentTab = ref(props.activeTab || (props.tabs && props.tabs[0]?.key) || '')

const handleClose = () => {
  emit('close')
  emit('update:show', false)
}

const handleSubmit = () => {
  emit('submit')
}

const switchTab = (tabKey: string) => {
  currentTab.value = tabKey
  emit('update:activeTab', tabKey)
}

const headerClasses = computed(() => {
  const base = 'px-6 py-4 border-b border-gray-200'
  
  switch (props.headerColor) {
    case 'blue':
      return `${base} bg-slate-700 text-white`
    case 'gray':
      return `${base} bg-gray-50 text-gray-900`
    case 'white':
    default:
      return `${base} bg-white text-gray-900`
  }
})

const contentClasses = computed(() => {
  const base = 'flex-1 overflow-auto'
  return props.contentPadding ? `${base} p-6` : base
})
</script>

<template>
  <BaseModal
    :show="show"
    :size="size"
    :persistent="persistent || loading"
    :position="position"
    @close="handleClose"
    @update:show="$emit('update:show', $event)"
  >
    <template #default="{ close }">
      <div class="bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div v-if="hasHeader" :class="headerClasses">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">{{ title }}</h3>
            <button 
              @click="handleClose"
              class="text-gray-400 hover:text-gray-600 transition-colors"
              :class="headerColor === 'blue' ? 'text-gray-300 hover:text-white' : ''"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div v-if="hasTabs && tabs" class="border-b border-gray-200 bg-white">
          <nav class="flex px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="switchTab(tab.key)"
              :disabled="tab.disabled"
              :class="[
                'py-3 px-1 mr-8 border-b-2 font-medium text-sm transition-colors',
                currentTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              ]"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Content -->
        <div :class="contentClasses">
          <slot 
            :currentTab="currentTab"
            :switchTab="switchTab"
            :formInline="formInline"
          />
        </div>

        <!-- Footer -->
        <div v-if="hasFooter" class="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            @click="handleClose"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ cancelText }}
          </button>
          <button
            @click="handleSubmit"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              处理中...
            </span>
            <span v-else>{{ submitText }}</span>
          </button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
/* 确保模态框内容可滚动 */
.max-h-\[90vh\] {
  max-height: 90vh;
}

/* Tab样式优化 */
.border-b-2 {
  border-bottom-width: 2px;
}

/* 按钮过渡效果 */
button {
  transition: all 0.2s ease-in-out;
}
</style>