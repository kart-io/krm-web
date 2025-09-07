<template>
  <div>
    <Modal
      v-bind="getMergedProps"
      v-model:open="visibleRef"
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <template #title v-if="!$slots.title">
        <div class="flex items-center">
          <span>{{ getProps.title }}</span>
          <Tooltip v-if="getProps.helpMessage" :title="getProps.helpMessage">
            <Icon icon="ant-design:question-circle-outlined" class="ml-2 cursor-help" />
          </Tooltip>
        </div>
      </template>
      
      <template v-for="item in Object.keys($slots)" #[item]="data" :key="item">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
      
      <template #footer v-if="!getProps.footer">
        <div class="flex justify-end space-x-2">
          <Button @click="handleCancel">{{ getProps.cancelText || '取消' }}</Button>
          <Button 
            type="primary" 
            @click="handleOk"
            :loading="getProps.confirmLoading"
          >
            {{ getProps.okText || '确定' }}
          </Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, unref, watchEffect } from 'vue'
import { Modal, Button, Tooltip } from 'ant-design-vue'
import Icon from '../IconRenderer.vue'

export interface BasicModalProps {
  title?: string
  helpMessage?: string
  width?: string | number
  height?: string | number
  minHeight?: number
  draggable?: boolean
  centered?: boolean
  cancelText?: string
  okText?: string
  confirmLoading?: boolean
  destroyOnClose?: boolean
  footer?: any
  defaultFullscreen?: boolean
}

interface ModalMethods {
  setModalProps: (props: Partial<BasicModalProps>) => void
  openModal: () => void
  closeModal: () => void
  redoModalHeight: () => void
}

const props = withDefaults(defineProps<BasicModalProps>(), {
  width: 800,
  draggable: true,
  centered: true,
  destroyOnClose: true,
  cancelText: '取消',
  okText: '确定'
})

const emit = defineEmits<{
  register: [modalInstance: ModalMethods]
  'update:open': [visible: boolean]
  cancel: [e: Event]
  ok: [e: Event]
}>()

const visibleRef = ref(false)
const propsRef = ref<Partial<BasicModalProps>>({})

const getProps = computed(() => {
  return { ...props, ...unref(propsRef) }
})

const getMergedProps = computed(() => {
  return {
    ...unref(getProps),
    open: unref(visibleRef),
    wrapClassName: `basic-modal ${unref(getProps).draggable ? 'modal-draggable' : ''}`
  }
})

const modalMethods: ModalMethods = {
  setModalProps: (modalProps: Partial<BasicModalProps>) => {
    propsRef.value = { ...unref(propsRef), ...modalProps }
  },
  
  openModal: () => {
    visibleRef.value = true
  },
  
  closeModal: () => {
    visibleRef.value = false
  },
  
  redoModalHeight: () => {
    // 重新计算模态框高度
  }
}

const handleCancel = (e: Event) => {
  visibleRef.value = false
  emit('cancel', e)
}

const handleOk = (e: Event) => {
  emit('ok', e)
}

// 注册Modal实例方法
emit('register', modalMethods)

watchEffect(() => {
  emit('update:open', unref(visibleRef))
})
</script>

<style scoped>
:deep(.basic-modal .ant-modal-content) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.basic-modal .ant-modal-header) {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
}

:deep(.basic-modal .ant-modal-title) {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

:deep(.basic-modal .ant-modal-body) {
  padding: 24px;
}

:deep(.basic-modal .ant-modal-footer) {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
}

/* 可拖拽样式 */
:deep(.modal-draggable .ant-modal-header) {
  cursor: move;
  user-select: none;
}
</style>