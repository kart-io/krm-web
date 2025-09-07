import { ref, unref } from 'vue'
import type { BasicModalProps } from '../components/modal/BasicModal.vue'

interface ModalMethods {
  setModalProps: (props: Partial<BasicModalProps>) => void
  openModal: () => void
  closeModal: () => void
  redoModalHeight: () => void
}

export function useModal(): [
  (instance: ModalMethods) => void,
  ModalMethods & {
    getVisible: () => boolean
  }
] {
  const modalRef = ref<ModalMethods>()
  const visibleRef = ref(false)

  const register = (instance: ModalMethods) => {
    modalRef.value = instance
  }

  const methods: ModalMethods & { getVisible: () => boolean } = {
    setModalProps: (props: Partial<BasicModalProps>) => {
      unref(modalRef)?.setModalProps(props)
    },

    openModal: () => {
      visibleRef.value = true
      unref(modalRef)?.openModal()
    },

    closeModal: () => {
      visibleRef.value = false
      unref(modalRef)?.closeModal()
    },

    redoModalHeight: () => {
      unref(modalRef)?.redoModalHeight()
    },

    getVisible: () => {
      return unref(visibleRef)
    }
  }

  return [register, methods]
}

export function useModalInner(callback?: () => void) {
  const visibleRef = ref(false)
  const modalInstanceRef = ref<ModalMethods>()

  const register = (instance: ModalMethods) => {
    modalInstanceRef.value = instance
  }

  const closeModal = () => {
    visibleRef.value = false
    unref(modalInstanceRef)?.closeModal()
    callback?.()
  }

  const setModalProps = (props: Partial<BasicModalProps>) => {
    unref(modalInstanceRef)?.setModalProps(props)
  }

  return {
    register,
    closeModal,
    setModalProps,
    visible: visibleRef
  }
}