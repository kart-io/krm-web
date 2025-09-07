<script setup lang="ts">
import { ref, computed } from 'vue'
import VxeUITable from 'vxe-table'

interface Deployment {
  id: string
  name: string
  namespace: string
  cluster: string
  ready: string
  upToDate: number
  available: number
  age: string
  image: string
  replicas: number
  strategy: string
}

const deployments = ref<Deployment[]>([
  {
    id: '1',
    name: 'nginx-deployment',
    namespace: 'default',
    cluster: 'production-cluster',
    ready: '3/3',
    upToDate: 3,
    available: 3,
    age: '2d',
    image: 'nginx:1.21',
    replicas: 3,
    strategy: 'RollingUpdate'
  },
  {
    id: '2',
    name: 'api-server',
    namespace: 'production',
    cluster: 'production-cluster',
    ready: '5/5',
    upToDate: 5,
    available: 5,
    age: '7d',
    image: 'api-server:v2.1.0',
    replicas: 5,
    strategy: 'RollingUpdate'
  },
  {
    id: '3',
    name: 'frontend-app',
    namespace: 'production',
    cluster: 'staging-cluster',
    ready: '2/3',
    upToDate: 2,
    available: 2,
    age: '1d',
    image: 'frontend:latest',
    replicas: 3,
    strategy: 'RollingUpdate'
  },
  {
    id: '4',
    name: 'worker-service',
    namespace: 'default',
    cluster: 'development-cluster',
    ready: '4/4',
    upToDate: 4,
    available: 4,
    age: '5d',
    image: 'worker:v1.3.2',
    replicas: 4,
    strategy: 'Recreate'
  },
  {
    id: '5',
    name: 'redis-cluster',
    namespace: 'database',
    cluster: 'production-cluster',
    ready: '3/3',
    upToDate: 3,
    available: 3,
    age: '10d',
    image: 'redis:6.2-alpine',
    replicas: 3,
    strategy: 'RollingUpdate'
  }
])

const searchTerm = ref('')
const selectedCluster = ref<string>('all')
const selectedNamespace = ref<string>('all')
const selectedStrategy = ref<string>('all')

const clusters = computed(() => {
  const uniqueClusters = [...new Set(deployments.value.map(deployment => deployment.cluster))]
  return ['all', ...uniqueClusters.sort()]
})

const namespaces = computed(() => {
  const uniqueNamespaces = [...new Set(deployments.value.map(deployment => deployment.namespace))]
  return ['all', ...uniqueNamespaces.sort()]
})

const strategies = computed(() => {
  const uniqueStrategies = [...new Set(deployments.value.map(deployment => deployment.strategy))]
  return ['all', ...uniqueStrategies.sort()]
})

const filteredDeployments = computed(() => {
  let filtered = deployments.value

  // Filter by cluster
  if (selectedCluster.value !== 'all') {
    filtered = filtered.filter(deployment => deployment.cluster === selectedCluster.value)
  }

  // Filter by namespace
  if (selectedNamespace.value !== 'all') {
    filtered = filtered.filter(deployment => deployment.namespace === selectedNamespace.value)
  }

  // Filter by strategy
  if (selectedStrategy.value !== 'all') {
    filtered = filtered.filter(deployment => deployment.strategy === selectedStrategy.value)
  }

  // Filter by search term
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(deployment => 
      deployment.name.toLowerCase().includes(search) ||
      deployment.namespace.toLowerCase().includes(search) ||
      deployment.cluster.toLowerCase().includes(search) ||
      deployment.image.toLowerCase().includes(search)
    )
  }

  return filtered
})

// 操作函数
const addDeployment = () => {
  console.log('添加部署')
}

const viewDeployment = (row: Deployment) => {
  console.log('查看部署:', row)
}

const editDeployment = (row: Deployment) => {
  console.log('编辑部署:', row)
}

const deleteDeployment = (row: Deployment) => {
  console.log('删除部署:', row)
}

const getReadyStatus = (ready: string) => {
  const [current, total] = ready.split('/').map(Number)
  return {
    isReady: current === total,
    percentage: total > 0 ? (current / total) * 100 : 0
  }
}

const scaleDeployment = (deployment: Deployment, change: number) => {
  const newReplicas = Math.max(0, deployment.replicas + change)
  deployment.replicas = newReplicas
  deployment.ready = `${Math.min(newReplicas, deployment.available)}/${newReplicas}`
}
</script>

<template>
  <div class="deployments-view">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="title-section">
          <h1 class="app-page-title">Kubernetes Deployments</h1>
          <p class="app-page-subtitle">Manage your Kubernetes deployments and scaling</p>
        </div>
        <div class="actions-section">
          <button @click="addDeployment" class="btn-primary">
            添加部署
          </button>
        </div>
      </div>

      <!-- Search and Filter Controls -->
      <div class="search-section">
        <div class="search-row">
          <div class="search-field">
            <label for="search">搜索</label>
            <input
              id="search"
              v-model="searchTerm"
              type="text"
              placeholder="搜索部署名称、命名空间、集群、镜像..."
              class="search-input"
            />
          </div>
          <div class="filter-field">
            <label for="cluster">集群</label>
            <select id="cluster" v-model="selectedCluster" class="filter-select">
              <option value="all">所有集群</option>
              <option v-for="cluster in clusters.slice(1)" :key="cluster" :value="cluster">
                {{ cluster }}
              </option>
            </select>
          </div>
          <div class="filter-field">
            <label for="namespace">命名空间</label>
            <select id="namespace" v-model="selectedNamespace" class="filter-select">
              <option value="all">所有命名空间</option>
              <option v-for="ns in namespaces.slice(1)" :key="ns" :value="ns">
                {{ ns }}
              </option>
            </select>
          </div>
          <div class="filter-field">
            <label for="strategy">策略</label>
            <select id="strategy" v-model="selectedStrategy" class="filter-select">
              <option value="all">所有策略</option>
              <option v-for="strategy in strategies.slice(1)" :key="strategy" :value="strategy">
                {{ strategy }}
              </option>
            </select>
          </div>
          <div class="results-info">
            显示 {{ filteredDeployments.length }} / {{ deployments.length }} 个部署
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <vxe-table 
          :data="filteredDeployments" 
          border="inner" 
          stripe
          height="600"
          size="mini"
          show-overflow="tooltip"
          :row-config="{ height: 32 }"
        >
          <vxe-column type="seq" title="序号" width="60"></vxe-column>
          
          <vxe-column field="name" title="部署名称" min-width="180">
            <template #default="{ row }">
              <div class="deployment-info">
                <div class="deployment-name">{{ row.name }}</div>
                <div class="deployment-namespace">{{ row.namespace }}</div>
              </div>
            </template>
          </vxe-column>
          
          <vxe-column field="cluster" title="集群" width="140">
            <template #default="{ row }">
              <span class="cluster-badge">{{ row.cluster }}</span>
            </template>
          </vxe-column>
          
          <vxe-column field="ready" title="就绪状态" width="100" align="center">
            <template #default="{ row }">
              <span class="ready-status" :class="{ 'not-ready': !getReadyStatus(row.ready).isReady }">
                {{ row.ready }}
              </span>
            </template>
          </vxe-column>
          
          <vxe-column field="replicas" title="副本数" width="100" align="center">
            <template #default="{ row }">
              <div class="replica-controls">
                <button 
                  class="scale-btn scale-down" 
                  @click="scaleDeployment(row, -1)"
                  :disabled="row.replicas <= 0"
                >
                  −
                </button>
                <span class="replica-count">{{ row.replicas }}</span>
                <button 
                  class="scale-btn scale-up" 
                  @click="scaleDeployment(row, 1)"
                >
                  +
                </button>
              </div>
            </template>
          </vxe-column>
          
          <vxe-column field="strategy" title="策略" width="120" align="center">
            <template #default="{ row }">
              <span class="strategy-badge" :class="{
                'strategy-rolling': row.strategy === 'RollingUpdate',
                'strategy-recreate': row.strategy === 'Recreate'
              }">
                {{ row.strategy }}
              </span>
            </template>
          </vxe-column>
          
          <vxe-column field="image" title="镜像" min-width="200">
            <template #default="{ row }">
              <code class="image-name">{{ row.image }}</code>
            </template>
          </vxe-column>
          
          <vxe-column field="age" title="运行时长" width="100" align="center"></vxe-column>
          
          <vxe-column title="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="actions">
                <button @click="viewDeployment(row)" class="btn btn-info">查看</button>
                <button @click="editDeployment(row)" class="btn btn-primary">编辑</button>
                <button @click="deleteDeployment(row)" class="btn btn-danger">删除</button>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.deployments-view {
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100vh;
}

.container {
  max-width: 1600px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.title-section h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
}

.title-section p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.actions-section {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.search-section {
  margin-bottom: 1.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: end;
}

.search-field {
  flex: 1;
  min-width: 200px;
}

.filter-field {
  min-width: 140px;
}

.search-field label,
.filter-field label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.search-input,
.filter-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.results-info {
  font-size: 0.875rem;
  color: #6b7280;
  white-space: nowrap;
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
}

.table-wrapper {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.deployment-info {
  padding: 0.5rem 0;
}

.deployment-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.deployment-namespace {
  font-size: 0.75rem;
  color: #6b7280;
}

.cluster-badge {
  background: #3b82f6;
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 0.625rem;
  font-weight: 500;
  line-height: 1.2;
}

.ready-status {
  font-weight: 500;
  color: #10b981;
  font-size: 0.75rem;
}

.ready-status.not-ready {
  color: #ef4444;
}

.replica-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.scale-btn {
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scale-down {
  background: #fee2e2;
  color: #dc2626;
}

.scale-down:hover:not(:disabled) {
  background: #fecaca;
}

.scale-down:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.scale-up {
  background: #dcfce7;
  color: #16a34a;
}

.scale-up:hover {
  background: #bbf7d0;
}

.replica-count {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1f2937;
  min-width: 1.5rem;
  text-align: center;
}

.strategy-badge {
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 0.625rem;
  font-weight: 500;
  line-height: 1.2;
}

.strategy-rolling {
  background: #10b981;
  color: #ffffff;
}

.strategy-recreate {
  background: #f59e0b;
  color: #ffffff;
}

.image-name {
  background: #f3f4f6;
  color: #1f2937;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.75rem;
  border: 1px solid #e5e7eb;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-info {
  background: #0891b2;
  color: white;
}

.btn-info:hover {
  background: #0e7490;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-danger:hover {
  background: #b91c1c;
}

/* VxeTable 样式覆盖 - 紧凑简洁风格 */
:deep(.vxe-table) {
  font-size: 0.75rem;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

:deep(.vxe-table .vxe-header--row .vxe-header--column) {
  background: #ffffff;
  color: #374151;
  font-weight: 500;
  font-size: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  border-right: 1px solid #f3f4f6;
  padding: 8px 12px;
  height: 36px;
}

:deep(.vxe-table .vxe-body--row) {
  border-bottom: 1px solid #f9fafb;
  height: 32px;
  transition: none;
}

:deep(.vxe-table .vxe-body--row:hover) {
  background: #f9fafb;
}

:deep(.vxe-table .vxe-body--row:nth-child(even)) {
  background-color: #fdfdfd;
}

:deep(.vxe-table .vxe-body--column) {
  border-right: 1px solid #f9fafb;
}

:deep(.vxe-table .vxe-cell) {
  padding: 4px 12px;
  font-size: 0.75rem;
  color: #374151;
  line-height: 1.4;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .search-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-field,
  .filter-field {
    min-width: auto;
    flex: none;
  }
  
  .results-info {
    justify-content: center;
  }
}


@media (max-width: 768px) {
  .deployments-grid {
    grid-template-columns: 1fr;
  }
  
  .deployment-status {
    grid-template-columns: 1fr;
  }
  
  .replica-info {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .modal {
    margin: 1rem;
  }
}
</style>