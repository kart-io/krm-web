<template>
  <Card
    v-bind="getMergedProps"
    :class="getCardClass"
  >
    <template #title v-if="!$slots.title">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Icon v-if="getProps.icon" :icon="getProps.icon" class="mr-2" />
          <span class="text-base font-semibold">{{ getProps.title }}</span>
          <Tooltip v-if="getProps.helpMessage" :title="getProps.helpMessage">
            <Icon icon="ant-design:question-circle-outlined" class="ml-2 cursor-help text-gray-400" />
          </Tooltip>
        </div>
        <div class="flex items-center space-x-2">
          <Button 
            v-if="getProps.showFullscreen" 
            type="text" 
            size="small"
            @click="toggleFullscreen"
          >
            <Icon :icon="fullscreenRef ? 'ant-design:fullscreen-exit-outlined' : 'ant-design:fullscreen-outlined'" />
          </Button>
          <Button 
            v-if="getProps.showRefresh" 
            type="text" 
            size="small"
            @click="handleRefresh"
            :loading="refreshLoading"
          >
            <Icon icon="ant-design:reload-outlined" />
          </Button>
        </div>
      </div>
    </template>

    <template #extra v-if="getProps.extra || $slots.extra">
      <slot name="extra">
        {{ getProps.extra }}
      </slot>
    </template>

    <template v-for="item in Object.keys($slots)" #[item]="data" :key="item">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>

    <!-- Loading 遮罩 -->
    <div v-if="getProps.loading" class="card-loading-mask">
      <Spin size="large" />
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, unref } from 'vue'
import { Card, Button, Tooltip, Spin } from 'ant-design-vue'
import Icon from '../IconRenderer.vue'

export interface BasicCardProps {
  title?: string
  icon?: string
  helpMessage?: string
  extra?: string
  loading?: boolean
  showFullscreen?: boolean
  showRefresh?: boolean
  bordered?: boolean
  hoverable?: boolean
  size?: 'small' | 'default'
  bodyStyle?: Record<string, any>
  headStyle?: Record<string, any>
}

const props = withDefaults(defineProps<BasicCardProps>(), {
  bordered: true,
  hoverable: true,
  size: 'default',
  showFullscreen: false,
  showRefresh: false
})

const emit = defineEmits<{
  refresh: []
  fullscreen: [isFullscreen: boolean]
}>()

const fullscreenRef = ref(false)
const refreshLoading = ref(false)
const propsRef = ref<Partial<BasicCardProps>>({})

const getProps = computed(() => {
  return { ...props, ...unref(propsRef) }
})

const getMergedProps = computed(() => {
  return {
    ...unref(getProps),
    bodyStyle: {
      position: 'relative' as const,
      ...unref(getProps).bodyStyle
    }
  }
})

const getCardClass = computed(() => {
  return [
    'basic-card',
    {
      'card-fullscreen': unref(fullscreenRef),
      'card-loading': unref(getProps).loading
    }
  ]
})

const toggleFullscreen = () => {
  fullscreenRef.value = !unref(fullscreenRef)
  emit('fullscreen', unref(fullscreenRef))
}

const handleRefresh = async () => {
  refreshLoading.value = true
  try {
    emit('refresh')
    // 模拟刷新延迟
    await new Promise(resolve => setTimeout(resolve, 300))
  } finally {
    refreshLoading.value = false
  }
}

const setCardProps = (cardProps: Partial<BasicCardProps>) => {
  propsRef.value = { ...unref(propsRef), ...cardProps }
}

defineExpose({
  setCardProps,
  toggleFullscreen
})
</script>

<style scoped>
.basic-card {
  transition: all 0.3s ease-in-out;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.basic-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.card-fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 1000 !important;
  border-radius: 0 !important;
}

.card-loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 8px;
}

:deep(.ant-card-head) {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
  border-radius: 8px 8px 0 0;
}

:deep(.ant-card-head-title) {
  padding: 16px 0;
}

:deep(.ant-card-body) {
  padding: 24px;
  background: white;
}

:deep(.ant-card-small .ant-card-head) {
  padding: 0 12px;
}

:deep(.ant-card-small .ant-card-body) {
  padding: 12px;
}
</style>