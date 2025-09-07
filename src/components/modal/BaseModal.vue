<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { Teleport } from 'vue'

interface Props {
  show: boolean
  persistent?: boolean // 点击背景不关闭
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  position?: 'center' | 'top' | 'bottom'
  backdrop?: 'dark' | 'light' | 'blur'
  zIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  persistent: false,
  size: 'md',
  position: 'center',
  backdrop: 'dark',
  zIndex: 50
})

const emit = defineEmits<{
  close: []
  'update:show': [value: boolean]
}>()

// 尺寸映射
const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full mx-4'
}

// 位置映射
const positionClasses = {
  center: 'items-center justify-center',
  top: 'items-start justify-center pt-16',
  bottom: 'items-end justify-center pb-16'
}

// 背景映射
const backdropClasses = {
  dark: 'bg-black bg-opacity-50',
  light: 'bg-white bg-opacity-75',
  blur: 'bg-black bg-opacity-30 backdrop-blur-sm'
}

const handleBackdropClick = (event: Event) => {
  if (!props.persistent && event.target === event.currentTarget) {
    handleClose()
  }
}

const handleClose = () => {
  emit('close')
  emit('update:show', false)
}

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show && !props.persistent) {
    handleClose()
  }
}

// 防止页面滚动
watch(() => props.show, (show) => {
  if (show) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 flex transition-all duration-300"
        :class="[
          positionClasses[position],
          backdropClasses[backdrop]
        ]"
        :style="{ zIndex }"
        @click="handleBackdropClick"
      >
        <Transition
          enter-active-class="transition-all ease-out duration-300"
          enter-from-class="opacity-0 transform scale-95"
          enter-to-class="opacity-100 transform scale-100"
          leave-active-class="transition-all ease-in duration-200"
          leave-from-class="opacity-100 transform scale-100"
          leave-to-class="opacity-0 transform scale-95"
        >
          <div
            v-if="show"
            class="relative w-full mx-4"
            :class="sizeClasses[size]"
            role="dialog"
            aria-modal="true"
          >
            <slot :close="handleClose" />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>