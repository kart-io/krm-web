<template>
  <Drawer
    v-bind="getMergedProps"
    v-model:open="visibleRef"
    @close="handleClose"
  >
    <template #title v-if="!$slots.title">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-lg font-semibold">{{ getProps.title }}</span>
          <Tooltip v-if="getProps.helpMessage" :title="getProps.helpMessage">
            <Icon icon="ant-design:question-circle-outlined" class="ml-2 cursor-help" />
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
        </div>
      </div>
    </template>

    <template v-for="item in Object.keys($slots)" #[item]="data" :key="item">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>

    <template #footer v-if="getProps.showFooter">
      <div class="flex justify-end space-x-2">
        <Button @click="handleClose">{{ getProps.cancelText || '取消' }}</Button>
        <Button 
          type="primary" 
          @click="handleSubmit"
          :loading="getProps.confirmLoading"
        >
          {{ getProps.okText || '确定' }}
        </Button>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed, unref, watchEffect } from 'vue'
import { Drawer, Button, Tooltip } from 'ant-design-vue'
import Icon from '../IconRenderer.vue'

export interface BasicDrawerProps {
  title?: string
  helpMessage?: string
  width?: string | number
  placement?: 'top' | 'right' | 'bottom' | 'left'
  showFooter?: boolean
  showFullscreen?: boolean
  cancelText?: string
  okText?: string
  confirmLoading?: boolean
  destroyOnClose?: boolean
  maskClosable?: boolean
  closable?: boolean
}

interface DrawerMethods {
  setDrawerProps: (props: Partial<BasicDrawerProps>) => void
  openDrawer: () => void
  closeDrawer: () => void
}

const props = withDefaults(defineProps<BasicDrawerProps>(), {
  width: 520,
  placement: 'right',
  showFooter: true,
  showFullscreen: true,
  destroyOnClose: true,
  maskClosable: true,
  closable: true,
  cancelText: '取消',
  okText: '确定'
})

const emit = defineEmits<{
  register: [drawerInstance: DrawerMethods]
  'update:open': [visible: boolean]
  close: []
  submit: []
}>()

const visibleRef = ref(false)
const fullscreenRef = ref(false)
const propsRef = ref<Partial<BasicDrawerProps>>({})

const getProps = computed(() => {
  return { ...props, ...unref(propsRef) }
})

const getMergedProps = computed(() => {
  const drawerProps = {
    ...unref(getProps),
    open: unref(visibleRef),
    width: unref(fullscreenRef) ? '100%' : unref(getProps).width,
    height: unref(fullscreenRef) ? '100%' : undefined,
    class: `basic-drawer ${unref(fullscreenRef) ? 'drawer-fullscreen' : ''}`
  }
  
  return drawerProps
})

const drawerMethods: DrawerMethods = {
  setDrawerProps: (drawerProps: Partial<BasicDrawerProps>) => {
    propsRef.value = { ...unref(propsRef), ...drawerProps }
  },
  
  openDrawer: () => {
    visibleRef.value = true
  },
  
  closeDrawer: () => {
    visibleRef.value = false
    fullscreenRef.value = false
  }
}

const handleClose = () => {
  visibleRef.value = false
  fullscreenRef.value = false
  emit('close')
}

const handleSubmit = () => {
  emit('submit')
}

const toggleFullscreen = () => {
  fullscreenRef.value = !unref(fullscreenRef)
}

// 注册Drawer实例方法
emit('register', drawerMethods)

watchEffect(() => {
  emit('update:open', unref(visibleRef))
})
</script>

<style scoped>
:deep(.basic-drawer .ant-drawer-content) {
  border-radius: 8px 0 0 8px;
  overflow: hidden;
}

:deep(.basic-drawer .ant-drawer-header) {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
}

:deep(.basic-drawer .ant-drawer-title) {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

:deep(.basic-drawer .ant-drawer-body) {
  padding: 24px;
  background: #fafbfc;
}

:deep(.basic-drawer .ant-drawer-footer) {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: white;
}

:deep(.drawer-fullscreen .ant-drawer-content) {
  border-radius: 0;
}

:deep(.drawer-fullscreen .ant-drawer-body) {
  height: calc(100vh - 128px);
  overflow-y: auto;
}
</style>