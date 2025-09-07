<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: string
  type?: 'success' | 'warning' | 'danger' | 'info' | 'default'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'sm',
  dot: false
})

const getStatusType = (status: string): string => {
  if (props.type !== 'default') {
    return props.type
  }
  
  const statusLower = status.toLowerCase()
  
  if (['healthy', 'active', 'running', 'success', 'online'].includes(statusLower)) {
    return 'success'
  } else if (['warning', 'pending', 'updating'].includes(statusLower)) {
    return 'warning'
  } else if (['error', 'failed', 'offline', 'down'].includes(statusLower)) {
    return 'danger'
  } else if (['info', 'unknown'].includes(statusLower)) {
    return 'info'
  }
  
  return 'default'
}

const statusType = computed(() => getStatusType(props.status))

const badgeClass = computed(() => {
  const classes = ['status-badge', `status-${statusType.value}`, `size-${props.size}`]
  
  if (props.dot) {
    classes.push('badge-dot')
  }
  
  return classes.join(' ')
})
</script>

<template>
  <span :class="badgeClass">
    <span v-if="dot" class="badge-dot-indicator"></span>
    <span class="badge-text">{{ status }}</span>
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  line-height: 1;
}

/* 尺寸 */
.size-sm {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
}

.size-md {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.size-lg {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

/* 类型样式 */
.status-success {
  background-color: #dcfce7;
  color: #166534;
}

.status-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.status-danger {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-info {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-default {
  background-color: #f3f4f6;
  color: #374151;
}

/* 带点样式 */
.badge-dot {
  padding-left: 0.25rem;
}

.badge-dot-indicator {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.status-success .badge-dot-indicator {
  background-color: #16a34a;
}

.status-warning .badge-dot-indicator {
  background-color: #ca8a04;
}

.status-danger .badge-dot-indicator {
  background-color: #dc2626;
}

.status-info .badge-dot-indicator {
  background-color: #2563eb;
}

.status-default .badge-dot-indicator {
  background-color: #6b7280;
}
</style>