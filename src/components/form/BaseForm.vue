<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  title?: string
  loading?: boolean
  submitText?: string
  cancelText?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  showCancel?: boolean
  showSubmit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  submitText: '保存',
  cancelText: '取消',
  size: 'md',
  showCancel: true,
  showSubmit: true,
  loading: false
})

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[32rem]',
    xl: 'w-[36rem]',
    '2xl': 'w-[42rem]'
  }
  return sizes[props.size]
})

const handleSubmit = () => {
  if (!props.loading) {
    emit('submit')
  }
}

const handleCancel = () => {
  if (!props.loading) {
    emit('cancel')
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg p-4 max-h-[80vh] overflow-y-auto" :class="sizeClasses">
    <!-- 标题 -->
    <div v-if="title" class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-gray-900">{{ title }}</h3>
      <button 
        v-if="showCancel"
        @click="handleCancel" 
        class="text-gray-400 hover:text-gray-600 transition-colors"
        :disabled="loading"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- 表单内容 -->
    <form @submit.prevent="handleSubmit" class="space-y-3">
      <slot />

      <!-- 按钮组 -->
      <div v-if="showCancel || showSubmit" class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          v-if="showCancel"
          type="button"
          @click="handleCancel"
          class="btn-secondary"
          :disabled="loading"
        >
          {{ cancelText }}
        </button>
        
        <button
          v-if="showSubmit"
          type="submit"
          class="btn-primary flex items-center space-x-2"
          :disabled="loading"
        >
          <svg
            v-if="loading"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
          <span>{{ loading ? '保存中...' : submitText }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
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
</style>