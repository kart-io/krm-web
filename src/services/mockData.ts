import type { 
  ClusterInfo, 
  PodInfo, 
  DeploymentInfo, 
  ServiceInfo, 
  DashboardMetrics,
  MenuGroup,
  MenuItem 
} from './kubernetesApi'

// Generate random values for realistic data
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const getRandomFloat = (min: number, max: number, decimals = 1) => +(Math.random() * (max - min) + min).toFixed(decimals)

// Helper function to generate random age strings
const generateAge = () => {
  const units = ['m', 'h', 'd']
  const unit = units[Math.floor(Math.random() * units.length)]
  let max = 60
  if (unit === 'h') max = 24
  if (unit === 'd') max = 30
  return `${getRandomInt(1, max)}${unit}`
}

// Kubernetes versions
const k8sVersions = ['v1.28.2', 'v1.28.1', 'v1.27.8', 'v1.27.5', 'v1.26.10']

// Mock Data Generators
export class MockDataService {
  // Dashboard Metrics
  static generateDashboardMetrics(): DashboardMetrics {
    return {
      clusters: getRandomInt(2, 5),
      nodes: getRandomInt(15, 50),
      pods: getRandomInt(80, 200),
      services: getRandomInt(20, 60),
      deployments: getRandomInt(25, 80)
    }
  }

  // Cluster Data
  static generateClusters(): ClusterInfo[] {
    const environments = ['production', 'staging', 'development', 'testing']
    const statuses: Array<'healthy' | 'warning' | 'error'> = ['healthy', 'healthy', 'healthy', 'warning', 'error'] // Weight healthy
    
    return environments.slice(0, getRandomInt(2, 4)).map(env => ({
      name: env,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      nodes: getRandomInt(2, 20),
      pods: getRandomInt(5, 80),
      cpu: getRandomInt(20, 90),
      memory: getRandomInt(30, 85),
      version: k8sVersions[Math.floor(Math.random() * k8sVersions.length)],
      endpoint: `https://${env}-k8s.kubeasy.com`
    }))
  }

  // Pod Data
  static generatePods(): PodInfo[] {
    const namespaces = ['default', 'kube-system', 'monitoring', 'database', 'apps']
    const statuses: Array<'Running' | 'Pending' | 'Failed' | 'Succeeded'> = ['Running', 'Running', 'Running', 'Pending', 'Failed']
    const podPrefixes = [
      'frontend-web', 'backend-api', 'database', 'redis-cache', 'worker-queue',
      'nginx-ingress', 'prometheus', 'grafana', 'elasticsearch', 'kibana',
      'mongodb', 'mysql', 'postgres', 'rabbitmq', 'kafka'
    ]

    return Array.from({ length: getRandomInt(15, 40) }, (_, i) => {
      const prefix = podPrefixes[Math.floor(Math.random() * podPrefixes.length)]
      const randomSuffix = Math.random().toString(36).substring(2, 15)
      
      return {
        name: `${prefix}-${randomSuffix}`,
        namespace: namespaces[Math.floor(Math.random() * namespaces.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        restarts: getRandomInt(0, 5),
        age: generateAge(),
        cpu: getRandomInt(10, 95),
        memory: getRandomInt(64, 1024),
        node: `worker-node-${getRandomInt(1, 10)}`
      }
    })
  }

  // Deployment Data
  static generateDeployments(): DeploymentInfo[] {
    const namespaces = ['default', 'apps', 'monitoring', 'database']
    const statuses: Array<'Available' | 'Progressing' | 'ReplicaFailure'> = ['Available', 'Available', 'Progressing', 'ReplicaFailure']
    const images = [
      'nginx:1.21', 'node:18-alpine', 'redis:7-alpine', 'postgres:14',
      'mongodb:5.0', 'grafana/grafana:latest', 'prometheus/prometheus:latest',
      'elasticsearch:8.5.0', 'rabbitmq:3.11-management', 'mysql:8.0'
    ]
    const deploymentNames = [
      'frontend-web', 'backend-api', 'user-service', 'notification-service',
      'payment-gateway', 'order-processor', 'inventory-manager', 'analytics-engine',
      'file-uploader', 'email-service', 'auth-service', 'database-migrator'
    ]

    return Array.from({ length: getRandomInt(8, 20) }, () => {
      const desired = getRandomInt(1, 10)
      const current = getRandomInt(Math.max(1, desired - 2), desired)
      const available = getRandomInt(Math.max(1, current - 1), current)
      
      return {
        name: deploymentNames[Math.floor(Math.random() * deploymentNames.length)],
        namespace: namespaces[Math.floor(Math.random() * namespaces.length)],
        replicas: { desired, current, available },
        status: statuses[Math.floor(Math.random() * statuses.length)],
        age: generateAge(),
        image: images[Math.floor(Math.random() * images.length)]
      }
    })
  }

  // Service Data
  static generateServices(): ServiceInfo[] {
    const namespaces = ['default', 'kube-system', 'monitoring', 'database']
    const types: Array<'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName'> = ['ClusterIP', 'NodePort', 'LoadBalancer', 'ExternalName']
    const protocols = ['TCP', 'UDP', 'SCTP']
    const serviceNames = [
      'frontend-service', 'backend-service', 'database-service', 'cache-service',
      'api-gateway', 'load-balancer', 'monitoring-service', 'logging-service',
      'webhook-service', 'notification-hub', 'file-storage', 'user-management'
    ]

    return Array.from({ length: getRandomInt(10, 25) }, () => {
      const type = types[Math.floor(Math.random() * types.length)]
      const hasExternal = type === 'LoadBalancer' && Math.random() > 0.5
      
      return {
        name: serviceNames[Math.floor(Math.random() * serviceNames.length)],
        namespace: namespaces[Math.floor(Math.random() * namespaces.length)],
        type,
        clusterIP: `10.${getRandomInt(96, 99)}.${getRandomInt(1, 255)}.${getRandomInt(1, 255)}`,
        externalIP: hasExternal ? `203.0.113.${getRandomInt(1, 255)}` : undefined,
        ports: Array.from({ length: getRandomInt(1, 3) }, () => ({
          port: getRandomInt(80, 9999),
          targetPort: getRandomInt(3000, 8080),
          protocol: protocols[Math.floor(Math.random() * protocols.length)]
        })),
        age: generateAge()
      }
    })
  }

  // Generate node data (additional for cluster details)
  static generateNodes() {
    return Array.from({ length: getRandomInt(3, 15) }, (_, i) => ({
      name: `worker-node-${i + 1}`,
      status: Math.random() > 0.1 ? 'Ready' : 'NotReady',
      roles: i === 0 ? ['control-plane', 'master'] : ['worker'],
      age: generateAge(),
      version: k8sVersions[Math.floor(Math.random() * k8sVersions.length)],
      cpu: `${getRandomInt(2, 16)} cores`,
      memory: `${getRandomInt(8, 64)}Gi`,
      cpu_usage: getRandomFloat(10, 85),
      memory_usage: getRandomFloat(20, 80)
    }))
  }

  // Generate namespace data
  static generateNamespaces() {
    const namespaces = ['default', 'kube-system', 'kube-public', 'kube-node-lease', 
                       'monitoring', 'logging', 'database', 'apps', 'ingress-nginx']
    
    return namespaces.map(name => ({
      name,
      status: 'Active',
      age: generateAge(),
      pods: getRandomInt(0, 20),
      services: getRandomInt(0, 10)
    }))
  }

  // Generate events data
  static generateEvents() {
    const types = ['Normal', 'Warning', 'Error']
    const reasons = [
      'Scheduled', 'Pulling', 'Pulled', 'Created', 'Started',
      'Failed', 'FailedMount', 'Unhealthy', 'BackOff', 'Killing'
    ]
    const objects = [
      'Pod/frontend-web-', 'Deployment/backend-api', 'Service/database-service',
      'Node/worker-node-', 'Ingress/api-gateway', 'Secret/app-secrets'
    ]

    return Array.from({ length: getRandomInt(20, 50) }, () => ({
      type: types[Math.floor(Math.random() * types.length)],
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      object: objects[Math.floor(Math.random() * objects.length)] + Math.random().toString(36).substring(2, 8),
      message: `Mock event message for ${reasons[Math.floor(Math.random() * reasons.length)]}`,
      age: generateAge(),
      count: getRandomInt(1, 10)
    }))
  }

  // Menu Data
  static generateMenus(): MenuGroup[] {
    return [
      {
        id: 'cluster-resources',
        title: '集群资源',
        icon: '🏢',
        order: 1,
        enabled: true,
        children: [
          {
            id: 'clusters',
            title: '集群管理',
            path: '/clusters',
            icon: '⚙️',
            order: 1,
            enabled: true,
            description: '管理Kubernetes集群',
            permissions: ['cluster:read']
          },
          {
            id: 'nodes',
            title: '节点管理',
            path: '/nodes',
            icon: '🖥️',
            order: 2,
            enabled: true,
            description: '管理集群节点',
            permissions: ['node:read']
          },
          {
            id: 'namespaces',
            title: '命名空间',
            path: '/namespaces',
            icon: '📁',
            order: 3,
            enabled: true,
            description: '管理命名空间',
            permissions: ['namespace:read']
          }
        ]
      },
      {
        id: 'workload-resources',
        title: '调度资源',
        icon: '📦',
        order: 2,
        enabled: true,
        children: [
          {
            id: 'deployments',
            title: 'Deployment',
            path: '/deployments',
            icon: '🚀',
            order: 1,
            enabled: true,
            description: '管理部署',
            permissions: ['deployment:read']
          },
          {
            id: 'replicasets',
            title: 'ReplicaSet',
            path: '/replicasets',
            icon: '📋',
            order: 2,
            enabled: true,
            description: '管理副本集',
            permissions: ['replicaset:read']
          },
          {
            id: 'daemonsets',
            title: 'DaemonSet',
            path: '/daemonsets',
            icon: '👹',
            order: 3,
            enabled: true,
            description: '管理守护进程集',
            permissions: ['daemonset:read']
          },
          {
            id: 'statefulsets',
            title: 'StatefulSet',
            path: '/statefulsets',
            icon: '💾',
            order: 4,
            enabled: true,
            description: '管理有状态应用',
            permissions: ['statefulset:read']
          },
          {
            id: 'jobs',
            title: 'Job/CronJob',
            path: '/jobs',
            icon: '⏰',
            order: 5,
            enabled: true,
            description: '管理作业调度',
            permissions: ['job:read']
          }
        ]
      },
      {
        id: 'service-discovery',
        title: '服务发现',
        icon: '🌐',
        order: 3,
        enabled: true,
        children: [
          {
            id: 'services',
            title: 'Service',
            path: '/services',
            icon: '🔗',
            order: 1,
            enabled: true,
            description: '管理服务',
            permissions: ['service:read']
          },
          {
            id: 'ingress',
            title: 'Ingress',
            path: '/ingress',
            icon: '🌍',
            order: 2,
            enabled: true,
            description: '管理入口控制器',
            permissions: ['ingress:read']
          },
          {
            id: 'endpoints',
            title: 'Endpoints',
            path: '/endpoints',
            icon: '🎯',
            order: 3,
            enabled: true,
            description: '管理服务端点',
            permissions: ['endpoint:read']
          }
        ]
      },
      {
        id: 'config-storage',
        title: '配置管理',
        icon: '⚙️',
        order: 4,
        enabled: true,
        children: [
          {
            id: 'configmaps',
            title: 'ConfigMap',
            path: '/configmaps',
            icon: '📋',
            order: 1,
            enabled: true,
            description: '管理配置映射',
            permissions: ['configmap:read']
          },
          {
            id: 'secrets',
            title: 'Secret',
            path: '/secrets',
            icon: '🔒',
            order: 2,
            enabled: true,
            description: '管理敏感信息',
            permissions: ['secret:read']
          },
          {
            id: 'storage',
            title: 'PV/PVC',
            path: '/storage',
            icon: '💽',
            order: 3,
            enabled: true,
            description: '管理存储卷',
            permissions: ['pv:read', 'pvc:read']
          }
        ]
      },
      {
        id: 'runtime',
        title: '运行时',
        icon: '🔄',
        order: 5,
        enabled: true,
        children: [
          {
            id: 'pods',
            title: 'Pod',
            path: '/pods',
            icon: '🐳',
            order: 1,
            enabled: true,
            description: '管理Pod实例',
            permissions: ['pod:read']
          },
          {
            id: 'events',
            title: '事件',
            path: '/events',
            icon: '📢',
            order: 2,
            enabled: true,
            description: '查看集群事件',
            permissions: ['event:read']
          },
          {
            id: 'logs',
            title: '日志',
            path: '/logs',
            icon: '📜',
            order: 3,
            enabled: true,
            description: '查看容器日志',
            permissions: ['log:read']
          }
        ]
      },
      {
        id: 'monitoring',
        title: '监控工具',
        icon: '📊',
        order: 6,
        enabled: true,
        children: [
          {
            id: 'metrics',
            title: '指标监控',
            path: '/metrics',
            icon: '📈',
            order: 1,
            enabled: true,
            description: '监控系统指标',
            permissions: ['metric:read']
          },
          {
            id: 'alerts',
            title: '告警管理',
            path: '/alerts',
            icon: '🚨',
            order: 2,
            enabled: true,
            description: '管理系统告警',
            permissions: ['alert:read']
          }
        ]
      },
      {
        id: 'tools',
        title: '实用工具',
        icon: '🛠️',
        order: 7,
        enabled: true,
        children: [
          {
            id: 'terminal',
            title: '终端',
            path: '/terminal',
            icon: '💻',
            order: 1,
            enabled: true,
            description: '在线终端工具',
            permissions: ['terminal:access']
          },
          {
            id: 'yaml-editor',
            title: 'YAML编辑',
            path: '/yaml-editor',
            icon: '📝',
            order: 2,
            enabled: true,
            description: 'YAML文件编辑器',
            permissions: ['yaml:edit']
          },
          {
            id: 'settings',
            title: '设置',
            path: '/settings',
            icon: '⚙️',
            order: 3,
            enabled: true,
            description: '系统设置',
            permissions: ['setting:manage']
          }
        ]
      },
      {
        id: 'system-management',
        title: '系统管理',
        icon: '🔧',
        order: 8,
        enabled: true,
        children: [
          {
            id: 'menu-management',
            title: '菜单管理',
            path: '/system/menus',
            icon: '📋',
            order: 1,
            enabled: true,
            description: '管理系统菜单结构',
            permissions: ['menu:manage']
          },
          {
            id: 'user-management',
            title: '用户管理',
            path: '/system/users',
            icon: '👥',
            order: 2,
            enabled: true,
            description: '管理系统用户',
            permissions: ['user:manage']
          },
          {
            id: 'role-management',
            title: '角色管理',
            path: '/system/roles',
            icon: '🎭',
            order: 3,
            enabled: true,
            description: '管理用户角色和权限',
            permissions: ['role:manage']
          },
          {
            id: 'oauth-config',
            title: 'OAuth配置',
            path: '/system/oauth',
            icon: '🔐',
            order: 4,
            enabled: true,
            description: '管理第三方登录配置',
            permissions: ['oauth:manage']
          }
        ]
      }
    ]
  }
}

// Static data cache with refresh mechanism
const dataCache = {
  dashboard: MockDataService.generateDashboardMetrics(),
  clusters: MockDataService.generateClusters(),
  pods: MockDataService.generatePods(),
  deployments: MockDataService.generateDeployments(),
  services: MockDataService.generateServices(),
  nodes: MockDataService.generateNodes(),
  namespaces: MockDataService.generateNamespaces(),
  events: MockDataService.generateEvents(),
  lastRefresh: Date.now()
}

// Refresh data every 30 seconds for realistic updates
setInterval(() => {
  // Only refresh some metrics to simulate real updates
  dataCache.dashboard = MockDataService.generateDashboardMetrics()
  
  // Randomly update pod CPU/Memory usage
  dataCache.pods = dataCache.pods.map(pod => ({
    ...pod,
    cpu: Math.random() > 0.7 ? getRandomInt(10, 95) : pod.cpu,
    memory: Math.random() > 0.7 ? getRandomInt(64, 1024) : pod.memory
  }))
  
  dataCache.lastRefresh = Date.now()
}, 30000)

export const mockDataCache = dataCache