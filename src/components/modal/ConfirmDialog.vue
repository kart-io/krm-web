<script setup lang="ts">
import BaseModal from './BaseModal.vue'

interface Props {
  show: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'info' | 'warning' | 'error' | 'success'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '确认操作',
  confirmText: '确认',
  cancelText: '取消',
  type: 'info',
  loading: false
})

const emit = defineEmits<{
  confirm: []
  cancel: []
  close: []
  'update:show': [value: boolean]
}>()

const typeConfig = {
  info: {
    icon: 'ℹ️',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-600',
    buttonClass: 'btn-primary'
  },
  warning: {
    icon: '⚠️',
    bgClass: 'bg-yellow-100',
    textClass: 'text-yellow-600',
    buttonClass: 'bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'
  },
  error: {
    icon: '❌',
    bgClass: 'bg-red-100',
    textClass: 'text-red-600',
    buttonClass: 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'
  },
  success: {
    icon: '✅',
    bgClass: 'bg-green-100',
    textClass: 'text-green-600',
    buttonClass: 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'
  }
}

const handleClose = () => {
  emit('close')
  emit('update:show', false)
}

const handleCancel = () => {
  emit('cancel')
  handleClose()
}

const handleConfirm = () => {
  if (!props.loading) {
    emit('confirm')
  }
}
</script>

<template>
  <BaseModal
    :show="show"
    size="sm"
    :persistent="loading"
    @close="handleClose"
    @update:show="$emit('update:show', $event)"
  >
    <div class="bg-white rounded-lg shadow-lg p-6">
      <!-- 图标和标题 -->
      <div class="flex items-center mb-4">
        <div 
          class="w-12 h-12 rounded-full flex items-center justify-center mr-4"
          :class="typeConfig[type].bgClass"
        >
          <span class="text-2xl">{{ typeConfig[type].icon }}</span>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        </div>
      </div>

      <!-- 消息内容 -->
      <div class="mb-6">
        <p class="text-gray-600 leading-relaxed">{{ message }}</p>
      </div>

      <!-- 按钮组 -->
      <div class="flex justify-end space-x-3">
        <button
          @click="handleCancel"
          class="btn-secondary"
          :disabled="loading"
        >
          {{ cancelText }}
        </button>
        
        <button
          @click="handleConfirm"
          :class="typeConfig[type].buttonClass"
          :disabled="loading"
          class="flex items-center space-x-2"
        >
          <svg
            v-if="loading"
            class="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{{ loading ? '处理中...' : confirmText }}</span>
        </button>
      </div>
    </div>
  </BaseModal>
</template>