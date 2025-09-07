import { ref, computed } from 'vue'
import { kubernetesApi, type MenuGroup } from './kubernetesApi'

class MenuService {
  private menus = ref<MenuGroup[]>([])
  private loading = ref(false)
  private error = ref<string | null>(null)

  constructor() {
    this.loadMenus()
  }

  async loadMenus() {
    this.loading.value = true
    this.error.value = null
    
    try {
      const menuData = await kubernetesApi.getMenus()
      // 按order排序并过滤启用的菜单
      this.menus.value = menuData
        .filter(group => group.enabled)
        .sort((a, b) => a.order - b.order)
        .map(group => ({
          ...group,
          children: group.children
            .filter(child => child.enabled)
            .sort((a, b) => a.order - b.order)
        }))
    } catch (err) {
      this.error.value = err instanceof Error ? err.message : '菜单加载失败'
      console.error('Failed to load menus:', err)
    } finally {
      this.loading.value = false
    }
  }

  // 根据权限过滤菜单项
  filterMenusByPermissions(userPermissions: string[] = []) {
    if (!userPermissions.length) return this.menus.value
    
    return this.menus.value.map(group => ({
      ...group,
      children: group.children.filter(child => {
        if (!child.permissions || !child.permissions.length) return true
        return child.permissions.some(permission => userPermissions.includes(permission))
      })
    })).filter(group => group.children.length > 0)
  }

  // 查找菜单项
  findMenuItem(path: string) {
    for (const group of this.menus.value) {
      for (const item of group.children) {
        if (item.path === path) {
          return { group, item }
        }
      }
    }
    return null
  }

  // 生成面包屑路径
  getBreadcrumbs(path: string) {
    const found = this.findMenuItem(path)
    if (!found) return []
    
    return [
      {
        id: 'home',
        title: '首页',
        path: '/',
        icon: '🏠'
      },
      {
        id: found.group.id,
        title: found.group.title,
        icon: found.group.icon
      },
      {
        id: found.item.id,
        title: found.item.title,
        path: found.item.path,
        icon: found.item.icon,
        description: found.item.description
      }
    ]
  }

  // 刷新菜单
  async refreshMenus() {
    await this.loadMenus()
  }

  // Computed properties
  get allMenus() {
    return computed(() => this.menus.value)
  }

  get isLoading() {
    return computed(() => this.loading.value)
  }

  get hasError() {
    return computed(() => this.error.value)
  }

  get errorMessage() {
    return computed(() => this.error.value)
  }
}

// 导出单例实例
export const menuService = new MenuService()
export default menuService