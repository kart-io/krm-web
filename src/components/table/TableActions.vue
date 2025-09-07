<script setup lang="ts">
import { computed } from 'vue'

interface Action {
  key: string
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  size?: 'mini' | 'small' | 'medium'
  icon?: string
  disabled?: boolean
  loading?: boolean
  visible?: boolean
  click?: (action: Action, row?: any) => void
}

interface Props {
  actions: Action[]
  row?: any
  maxVisible?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxVisible: 3
})

const emit = defineEmits<{
  'action-click': [key: string, row?: any]
}>()

// 分离显示的和隐藏在更多菜单中的操作
const visibleActions = computed(() => 
  props.actions.filter(action => action.visible !== false).slice(0, props.maxVisible)
)

const moreActions = computed(() => 
  props.actions.filter(action => action.visible !== false).slice(props.maxVisible)
)

const handleActionClick = (action: Action) => {
  if (action.disabled || action.loading) return
  
  action.click?.(action, props.row)
  emit('action-click', action.key, props.row)
}

const getButtonClass = (action: Action) => {
  const classes = ['action-btn']
  
  if (action.type) {
    classes.push(`btn-${action.type}`)
  } else {
    classes.push('btn-secondary')
  }
  
  if (action.size) {
    classes.push(`btn-${action.size}`)
  } else {
    classes.push('btn-sm')
  }
  
  if (action.disabled) {
    classes.push('btn-disabled')
  }
  
  return classes.join(' ')
}
</script>

<template>
  <div class="table-actions">
    <!-- 直接显示的操作按钮 -->
    <button
      v-for="action in visibleActions"
      :key="action.key"
      :class="getButtonClass(action)"
      :disabled="action.disabled || action.loading"
      @click="handleActionClick(action)"
    >
      <i v-if="action.icon && !action.loading" :class="action.icon"></i>
      <i v-if="action.loading" class="loading-icon"></i>
      {{ action.label }}
    </button>
    
    <!-- 更多操作下拉菜单 -->
    <div v-if="moreActions.length > 0" class="more-actions">
      <button class="more-btn btn-secondary btn-sm">
        更多 ▼
      </button>
      <div class="more-dropdown">
        <div
          v-for="action in moreActions"
          :key="action.key"
          class="dropdown-item"
          :class="{ 'disabled': action.disabled || action.loading }"
          @click="handleActionClick(action)"
        >
          <i v-if="action.icon && !action.loading" :class="action.icon"></i>
          <i v-if="action.loading" class="loading-icon"></i>
          {{ action.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  position: relative;
}

.action-btn {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}

.btn-primary:hover:not(.btn-disabled) {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.btn-secondary:hover:not(.btn-disabled) {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.btn-success {
  background-color: #059669;
  color: white;
}

.btn-success:hover:not(.btn-disabled) {
  background-color: #047857;
}

.btn-warning {
  background-color: #d97706;
  color: white;
}

.btn-warning:hover:not(.btn-disabled) {
  background-color: #b45309;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
}

.btn-danger:hover:not(.btn-disabled) {
  background-color: #b91c1c;
}

.btn-info {
  background-color: #0891b2;
  color: white;
}

.btn-info:hover:not(.btn-disabled) {
  background-color: #0e7490;
}

.btn-text {
  background-color: transparent;
  color: #2563eb;
  border-color: transparent;
}

.btn-text:hover:not(.btn-disabled) {
  background-color: #eff6ff;
  color: #1d4ed8;
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.btn-mini {
  padding: 0.125rem 0.375rem;
  font-size: 0.625rem;
}

.btn-medium {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.more-actions {
  position: relative;
  display: inline-block;
}

.more-btn {
  position: relative;
}

.more-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.25rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 50;
  min-width: 120px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: all 0.2s;
}

.more-actions:hover .more-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: background-color 0.2s;
}

.dropdown-item:hover:not(.disabled) {
  background-color: #f3f4f6;
}

.dropdown-item:first-child {
  border-radius: 0.375rem 0.375rem 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 0.375rem 0.375rem;
}

.dropdown-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-icon {
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  border: 2px solid currentColor;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>