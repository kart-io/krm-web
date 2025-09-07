<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox'
  modelValue?: string | number | boolean
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  options?: Array<{ label: string; value: string | number }>
  rows?: number
  min?: number
  max?: number
  step?: number
  help?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  rows: 3
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
}>()

const inputId = computed(() => `field-${Math.random().toString(36).substring(2, 9)}`)

const inputValue = computed({
  get: () => {
    if (props.type === 'checkbox') {
      return props.modelValue as boolean ?? false
    }
    return props.modelValue ?? ''
  },
  set: (value) => {
    if (props.type === 'checkbox') {
      emit('update:modelValue', Boolean(value))
    } else {
      emit('update:modelValue', value ?? '')
    }
  }
})

const inputClasses = computed(() => [
  'input-field',
  {
    'border-red-300 focus:ring-red-500 focus:border-red-500': props.error,
    'bg-gray-100 cursor-not-allowed': props.disabled
  }
])
</script>

<template>
  <div class="form-field">
    <label 
      :for="inputId" 
      class="block text-sm font-medium text-gray-700 mb-2"
      :class="{ 'after:content-[\' *\'] after:text-red-500': required }"
    >
      {{ label }}
    </label>

    <!-- 文本输入 -->
    <input
      v-if="type === 'text' || type === 'email' || type === 'password'"
      :id="inputId"
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
    />

    <!-- 数字输入 -->
    <input
      v-else-if="type === 'number'"
      :id="inputId"
      v-model.number="inputValue"
      type="number"
      :placeholder="placeholder"
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="step"
      :class="inputClasses"
    />

    <!-- 文本区域 -->
    <textarea
      v-else-if="type === 'textarea'"
      :id="inputId"
      v-model="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :class="inputClasses"
    ></textarea>

    <!-- 选择框 -->
    <select
      v-else-if="type === 'select'"
      :id="inputId"
      :value="String(inputValue)"
      @input="(e) => inputValue = (e.target as HTMLSelectElement).value"
      :disabled="disabled"
      :class="inputClasses"
    >
      <option value="" disabled>{{ placeholder || '请选择' }}</option>
      <option 
        v-for="option in options" 
        :key="option.value" 
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- 复选框 -->
    <label
      v-else-if="type === 'checkbox'"
      class="flex items-center space-x-2 cursor-pointer"
    >
      <input
        :id="inputId"
        v-model="inputValue"
        type="checkbox"
        :disabled="disabled"
        class="rounded border-gray-300 text-kubernetes-600 shadow-sm focus:border-kubernetes-300 focus:ring focus:ring-kubernetes-200 focus:ring-opacity-50 disabled:opacity-50"
      />
      <span class="text-sm text-gray-700">{{ placeholder }}</span>
    </label>

    <!-- 帮助文本 -->
    <p v-if="help && !error" class="mt-1 text-sm text-gray-500">{{ help }}</p>
    
    <!-- 错误信息 -->
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<style scoped>
.form-field {
  @apply mb-3;
}

.input-field {
  @apply w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kubernetes-500 focus:border-transparent transition-colors;
}

/* 必填标记样式 */
.after\:content-\[\'\\ \\*\'\]::after {
  content: ' *';
  color: #ef4444;
}
</style>