export interface MenuItem {
  id: string
  title: string
  path?: string
  icon: string
  children?: MenuItem[]
  badge?: string | number
  description?: string
}

export const menuConfig: MenuItem[] = [
  {
    id: 'cluster-resources',
    title: '集群资源',
    icon: '🏢',
    children: [
      {
        id: 'cluster-management',
        title: '集群管理',
        path: '/clusters',
        icon: '🖥️',
        description: '管理和监控Kubernetes集群'
      },
      {
        id: 'node-management', 
        title: '节点管理',
        path: '/nodes',
        icon: '🖲️',
        description: '查看和管理集群节点'
      },
      {
        id: 'namespaces',
        title: '命名空间',
        path: '/namespaces',
        icon: '📁',
        description: '管理Kubernetes命名空间'
      }
    ]
  },
  {
    id: 'workload-resources',
    title: '调度资源',
    icon: '⚙️',
    children: [
      {
        id: 'deployments',
        title: 'Deployment',
        path: '/deployments',
        icon: '🚀',
        description: '管理应用部署'
      },
      {
        id: 'replicasets',
        title: 'ReplicaSet',
        path: '/replicasets',
        icon: '📊',
        description: '副本集管理'
      },
      {
        id: 'daemonsets',
        title: 'DaemonSet',
        path: '/daemonsets',
        icon: '👨‍💼',
        description: '守护进程集'
      },
      {
        id: 'statefulsets',
        title: 'StatefulSet',
        path: '/statefulsets',
        icon: '💾',
        description: '有状态应用集'
      },
      {
        id: 'jobs',
        title: 'Job/CronJob',
        path: '/jobs',
        icon: '⏰',
        description: '任务和定时任务'
      }
    ]
  },
  {
    id: 'service-discovery',
    title: '服务发现',
    icon: '🔗',
    children: [
      {
        id: 'services',
        title: 'Service',
        path: '/services', 
        icon: '🌐',
        description: '服务管理'
      },
      {
        id: 'ingress',
        title: 'Ingress',
        path: '/ingress',
        icon: '🚪',
        description: '入口控制器'
      },
      {
        id: 'endpoints',
        title: 'Endpoints',
        path: '/endpoints',
        icon: '🎯',
        description: '服务端点'
      }
    ]
  },
  {
    id: 'config-storage',
    title: '配置管理',
    icon: '📋',
    children: [
      {
        id: 'configmaps',
        title: 'ConfigMap',
        path: '/configmaps',
        icon: '📄',
        description: '配置映射'
      },
      {
        id: 'secrets',
        title: 'Secret',
        path: '/secrets',
        icon: '🔐',
        description: '密钥管理'
      },
      {
        id: 'persistentvolumes',
        title: 'PV/PVC',
        path: '/storage',
        icon: '💿',
        description: '存储卷管理'
      }
    ]
  },
  {
    id: 'runtime-resources',
    title: '运行时',
    icon: '🏃',
    children: [
      {
        id: 'pods',
        title: 'Pod',
        path: '/pods',
        icon: '📦',
        badge: 'Hot',
        description: '容器组管理'
      },
      {
        id: 'events',
        title: '事件',
        path: '/events',
        icon: '📅',
        description: '集群事件日志'
      },
      {
        id: 'logs',
        title: '日志',
        path: '/logs',
        icon: '📝',
        description: '应用日志查看'
      }
    ]
  },
  {
    id: 'monitoring',
    title: '监控工具',
    icon: '📊',
    children: [
      {
        id: 'dashboard',
        title: '仪表板',
        path: '/',
        icon: '📈',
        description: '集群监控仪表板'
      },
      {
        id: 'metrics',
        title: '指标监控',
        path: '/metrics',
        icon: '⚡',
        description: '性能指标监控'
      },
      {
        id: 'alerts',
        title: '告警管理',
        path: '/alerts',
        icon: '🚨',
        description: '告警规则和通知'
      }
    ]
  },
  {
    id: 'system-tools',
    title: '实用工具',
    icon: '🛠️',
    children: [
      {
        id: 'terminal',
        title: '终端',
        path: '/terminal',
        icon: '💻',
        description: 'Web终端连接'
      },
      {
        id: 'yaml-editor',
        title: 'YAML编辑',
        path: '/yaml-editor',
        icon: '✏️',
        description: 'Kubernetes资源编辑器'
      },
      {
        id: 'settings',
        title: '设置',
        path: '/settings',
        icon: '⚙️',
        description: '系统设置'
      }
    ]
  }
]

// 扁平化菜单项，便于路由查找
export const flatMenuItems: Record<string, MenuItem> = {}

function flattenMenu(items: MenuItem[]) {
  items.forEach(item => {
    if (item.path) {
      flatMenuItems[item.path] = item
    }
    if (item.children) {
      flattenMenu(item.children)
    }
  })
}

flattenMenu(menuConfig)

// 获取当前激活的菜单项
export function getActiveMenuItem(currentPath: string): MenuItem | null {
  return flatMenuItems[currentPath] || null
}

// 获取面包屑导航
export function getBreadcrumbs(currentPath: string): MenuItem[] {
  const breadcrumbs: MenuItem[] = []
  
  function findInMenu(items: MenuItem[], path: string): boolean {
    for (const item of items) {
      if (item.path === path) {
        breadcrumbs.unshift(item)
        return true
      }
      if (item.children && findInMenu(item.children, path)) {
        breadcrumbs.unshift(item)
        return true
      }
    }
    return false
  }
  
  findInMenu(menuConfig, currentPath)
  return breadcrumbs
}