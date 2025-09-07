import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    
    // 集群资源
    {
      path: '/clusters',
      name: 'clusters',
      component: () => import('../views/ClustersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/nodes',
      name: 'nodes',
      component: () => import('../views/NodesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/namespaces',
      name: 'namespaces',
      component: () => import('../views/NamespacesView.vue'),
      meta: { requiresAuth: true }
    },
    
    // 调度资源
    {
      path: '/deployments',
      name: 'deployments',
      component: () => import('../views/DeploymentsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/replicasets',
      name: 'replicasets',
      component: () => import('../views/ComingSoonView.vue'),
      meta: { requiresAuth: true, title: 'ReplicaSet' }
    },
    {
      path: '/daemonsets',
      name: 'daemonsets',
      component: () => import('../views/ComingSoonView.vue'),
      meta: { requiresAuth: true, title: 'DaemonSet' }
    },
    {
      path: '/statefulsets',
      name: 'statefulsets',
      component: () => import('../views/ComingSoonView.vue'),
      meta: { requiresAuth: true, title: 'StatefulSet' }
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import('../views/ComingSoonView.vue'),
      meta: { requiresAuth: true, title: 'Job/CronJob' }
    },
    
    // 服务发现
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/ServicesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/ingress',
      name: 'ingress',
      component: () => import('../views/ComingSoonView.vue'),
      meta: { requiresAuth: true, title: 'Ingress' }
    },
    {
      path: '/endpoints',
      name: 'endpoints',
      component: () => import('../views/ComingSoonView.vue'),
      meta: { requiresAuth: true, title: 'Endpoints' }
    },
    
    // 配置管理
    {
      path: '/configmaps',
      name: 'configmaps',
      component: () => import('../views/ComingSoonView.vue'),
      meta: { requiresAuth: true, title: 'ConfigMap' }
    },
    {
      path: '/secrets',
      name: 'secrets',
      component: () => import('../views/ComingSoonView.vue'),
      meta: { requiresAuth: true, title: 'Secret' }
    },
    {
      path: '/storage',
      name: 'storage',
      component: () => import('../views/ComingSoonView.vue'),
      meta: { requiresAuth: true, title: 'PV/PVC' }
    },
    
    // 运行时
    {
      path: '/pods',
      name: 'pods',
      component: () => import('../views/PodsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/ComingSoonView.vue'),
      meta: { requiresAuth: true, title: '事件' }
    },
    {
      path: '/logs',
      name: 'logs',
      component: () => import('../views/ComingSoonView.vue'),
      meta: { requiresAuth: true, title: '日志' }
    },
    
    // 监控工具
    {
      path: '/metrics',
      name: 'metrics',
      component: () => import('../views/ComingSoonView.vue'),
      meta: { requiresAuth: true, title: '指标监控' }
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: () => import('../views/ComingSoonView.vue'),
      meta: { requiresAuth: true, title: '告警管理' }
    },
    
    // 实用工具
    {
      path: '/terminal',
      name: 'terminal',
      component: () => import('../views/ComingSoonView.vue'),
      meta: { requiresAuth: true, title: '终端' }
    },
    {
      path: '/yaml-editor',
      name: 'yaml-editor',
      component: () => import('../views/ComingSoonView.vue'),
      meta: { requiresAuth: true, title: 'YAML编辑' }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/ComingSoonView.vue'),
      meta: { requiresAuth: true, title: '设置' }
    },
    
    // 保留原有页面
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    },
    
    // 系统管理
    {
      path: '/system/menus',
      name: 'menu-management',
      component: () => import('../views/system/MenuManagementView.vue'),
      meta: { requiresAuth: true, title: '菜单管理' }
    },
    {
      path: '/system/modal-examples',
      name: 'modal-examples',
      component: () => import('../components/modal/UnifiedModalExamples.vue'),
      meta: { requiresAuth: true, title: '统一模态框示例' }
    },
    {
      path: '/system/users',
      name: 'user-management',
      component: () => import('../views/system/UserManagementView.vue'),
      meta: { requiresAuth: true, title: '用户管理' }
    },
    {
      path: '/system/roles',
      name: 'role-management',
      component: () => import('../views/system/RoleManagementView.vue'),
      meta: { requiresAuth: true, title: '角色管理' }
    },
    {
      path: '/system/oauth',
      name: 'oauth-config',
      component: () => import('../views/system/OAuthConfigView.vue'),
      meta: { requiresAuth: true, title: 'OAuth配置' }
    },
  ],
})

// Route guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Redirect to login page
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    // Route doesn't require auth (like login page)
    if (to.name === 'login' && authStore.isAuthenticated) {
      // If already authenticated and trying to access login, redirect to dashboard
      next({ name: 'home' })
    } else {
      next()
    }
  }
})

export default router
