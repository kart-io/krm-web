import { ref, unref } from 'vue'
import type { BasicDrawerProps } from '../components/drawer/BasicDrawer.vue'

interface DrawerMethods {
  setDrawerProps: (props: Partial<BasicDrawerProps>) => void
  openDrawer: () => void
  closeDrawer: () => void
}

export function useDrawer(): [
  (instance: DrawerMethods) => void,
  DrawerMethods & {
    getVisible: () => boolean
  }
] {
  const drawerRef = ref<DrawerMethods>()
  const visibleRef = ref(false)

  const register = (instance: DrawerMethods) => {
    drawerRef.value = instance
  }

  const methods: DrawerMethods & { getVisible: () => boolean } = {
    setDrawerProps: (props: Partial<BasicDrawerProps>) => {
      unref(drawerRef)?.setDrawerProps(props)
    },

    openDrawer: () => {
      visibleRef.value = true
      unref(drawerRef)?.openDrawer()
    },

    closeDrawer: () => {
      visibleRef.value = false
      unref(drawerRef)?.closeDrawer()
    },

    getVisible: () => {
      return unref(visibleRef)
    }
  }

  return [register, methods]
}

export function useDrawerInner(callback?: () => void) {
  const visibleRef = ref(false)
  const drawerInstanceRef = ref<DrawerMethods>()

  const register = (instance: DrawerMethods) => {
    drawerInstanceRef.value = instance
  }

  const closeDrawer = () => {
    visibleRef.value = false
    unref(drawerInstanceRef)?.closeDrawer()
    callback?.()
  }

  const setDrawerProps = (props: Partial<BasicDrawerProps>) => {
    unref(drawerInstanceRef)?.setDrawerProps(props)
  }

  return {
    register,
    closeDrawer,
    setDrawerProps,
    visible: visibleRef
  }
}