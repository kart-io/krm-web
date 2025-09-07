<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import BaseForm from '../form/BaseForm.vue'

interface Props {
  show: boolean
  title?: string
  loading?: boolean
  submitText?: string
  cancelText?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  persistent?: boolean
  position?: 'center' | 'top' | 'bottom'
}

const props = withDefaults(defineProps<Props>(), {
  submitText: '保存',
  cancelText: '取消',
  size: 'md',
  persistent: false,
  position: 'center',
  loading: false
})

const emit = defineEmits<{
  close: []
  submit: []
  'update:show': [value: boolean]
}>()

const handleClose = () => {
  emit('close')
  emit('update:show', false)
}

const handleSubmit = () => {
  emit('submit')
}
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
      <BaseForm
        :title="title"
        :loading="loading"
        :submit-text="submitText"
        :cancel-text="cancelText"
        :size="size"
        @submit="handleSubmit"
        @cancel="handleClose"
      >
        <slot />
      </BaseForm>
    </template>
  </BaseModal>
</template>