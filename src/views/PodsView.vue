<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { kubernetesApi, type PodInfo } from '../services/kubernetesApi'
import VxeUITable from 'vxe-table'

const pods = ref<PodInfo[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedNamespace = ref<string>('all')
const searchTerm = ref('')

const namespaces = computed(() => {
  const uniqueNamespaces = [...new Set(pods.value.map(pod => pod.namespace))]
  return ['all', ...uniqueNamespaces.sort()]
})

const filteredPods = computed(() => {
  let filtered = pods.value

  // Filter by namespace
  if (selectedNamespace.value !== 'all') {
    filtered = filtered.filter(pod => pod.namespace === selectedNamespace.value)
  }

  // Filter by search term
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(pod => 
      pod.name.toLowerCase().includes(search) ||
      pod.namespace.toLowerCase().includes(search) ||
      pod.node?.toLowerCase().includes(search)
    )
  }

  return filtered
})

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Running': return 'status-healthy'
    case 'Pending': return 'status-warning'
    case 'Failed': return 'status-error'
    case 'Succeeded': return 'status-healthy'
    default: return 'status-warning'
  }
}

const getUsageColor = (usage: number) => {
  if (usage > 80) return 'text-red-600'
  if (usage > 60) return 'text-yellow-600'
  return 'text-green-600'
}

const loadPods = async () => {
  try {
    loading.value = true
    error.value = null
    pods.value = await kubernetesApi.getPods()
  } catch (err: any) {
    error.value = err.message || 'Failed to load pods'
  } finally {
    loading.value = false
  }
}

// 操作函数
const viewPod = (row: PodInfo) => {
  console.log('查看Pod:', row)
}

const editPod = (row: PodInfo) => {
  console.log('编辑Pod:', row)
}

const deletePod = (row: PodInfo) => {
  console.log('删除Pod:', row)
}

onMounted(() => {
  loadPods()
})
</script>

<template>
  <div class="pods-view">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="title-section">
          <h1 class="app-page-title">Kubernetes Pods</h1>
          <p class="app-page-subtitle">Monitor and manage your pods across all namespaces</p>
        </div>
        <div class="actions-section">
          <button @click="loadPods" class="btn-primary flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>刷新</span>
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
              placeholder="搜索Pod名称、命名空间、节点..."
              class="search-input"
            />
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
          <div class="results-info">
            显示 {{ filteredPods.length }} / {{ pods.length }} 个Pod
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-kubernetes-500"></div>
        <span class="text-lg text-gray-600">加载中...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">加载失败</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button @click="loadPods" class="btn-primary">重试</button>
      </div>

      <!-- Pods Table -->
      <div v-else class="table-wrapper">
        <vxe-table 
          :data="filteredPods" 
          border="inner" 
          stripe
          height="600"
          size="mini"
          show-overflow="tooltip"
          :row-config="{ height: 32 }"
        >
          <vxe-column type="seq" title="序号" width="60"></vxe-column>
          
          <vxe-column field="name" title="Pod名称" min-width="200">
            <template #default="{ row }">
              <div class="pod-info">
                <div class="pod-name">{{ row.name }}</div>
                <div class="pod-namespace">{{ row.namespace }}</div>
              </div>
            </template>
          </vxe-column>
          
          <vxe-column field="status" title="状态" width="100">
            <template #default="{ row }">
              <span class="status-badge" :class="getStatusBadgeClass(row.status)">
                {{ row.status }}
              </span>
            </template>
          </vxe-column>
          
          <vxe-column field="node" title="节点" width="140">
            <template #default="{ row }">
              <span class="node-name">{{ row.node || 'Unknown' }}</span>
            </template>
          </vxe-column>
          
          <vxe-column field="cpu" title="CPU使用率" width="110" align="center">
            <template #default="{ row }">
              <div class="resource-usage">
                <span class="usage-text" :class="getUsageColor(row.cpu)">{{ row.cpu }}%</span>
                <div class="usage-bar">
                  <div 
                    class="usage-fill"
                    :class="{
                      'bg-green-500': row.cpu <= 60,
                      'bg-yellow-500': row.cpu > 60 && row.cpu <= 80,
                      'bg-red-500': row.cpu > 80
                    }"
                    :style="{ width: Math.min(row.cpu, 100) + '%' }"
                  ></div>
                </div>
              </div>
            </template>
          </vxe-column>
          
          <vxe-column field="memory" title="内存使用" width="110" align="center">
            <template #default="{ row }">
              <div class="resource-usage">
                <span class="usage-text">{{ row.memory }}MB</span>
                <div class="usage-bar">
                  <div 
                    class="usage-fill"
                    :class="{
                      'bg-green-500': row.memory <= 256,
                      'bg-yellow-500': row.memory > 256 && row.memory <= 512,
                      'bg-red-500': row.memory > 512
                    }"
                    :style="{ width: Math.min(row.memory / 10, 100) + '%' }"
                  ></div>
                </div>
              </div>
            </template>
          </vxe-column>
          
          <vxe-column field="restarts" title="重启次数" width="90" align="center">
            <template #default="{ row }">
              <span class="restart-count" :class="row.restarts > 3 ? 'text-red-600' : 'text-gray-900'">
                {{ row.restarts }}
              </span>
            </template>
          </vxe-column>
          
          <vxe-column field="age" title="运行时长" width="100" align="center"></vxe-column>
          
          <vxe-column title="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="actions">
                <button @click="viewPod(row)" class="btn btn-info">查看</button>
                <button @click="editPod(row)" class="btn btn-primary">编辑</button>
                <button @click="deletePod(row)" class="btn btn-danger">删除</button>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && filteredPods.length === 0" class="empty-state">
        <div class="text-gray-400 text-6xl mb-4">📦</div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">未找到Pod</h3>
        <p class="text-gray-600">
          {{ searchTerm || selectedNamespace !== 'all' ? '尝试调整搜索条件' : '当前没有运行的Pod' }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pods-view {
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

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;
}

.error-state {
  background: white;
  padding: 3rem;
  border-radius: 0.75rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-state {
  text-align: center;
  padding: 3rem;
}

.table-wrapper {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pod-info {
  padding: 0.5rem 0;
}

.pod-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.75rem;
}

.pod-namespace {
  font-size: 0.75rem;
  color: #6b7280;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 0.625rem;
  font-weight: 500;
  line-height: 1.2;
}

.status-healthy {
  background: #10b981;
  color: #ffffff;
}

.status-warning {
  background: #f59e0b;
  color: #ffffff;
}

.status-error {
  background: #ef4444;
  color: #ffffff;
}

.node-name {
  font-size: 0.75rem;
  color: #374151;
  font-weight: 500;
}

.resource-usage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
}

.usage-text {
  font-size: 0.75rem;
  font-weight: 600;
}

.usage-bar {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.usage-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 2px;
}

.bg-green-500 {
  background-color: #10b981;
}

.bg-yellow-500 {
  background-color: #f59e0b;
}

.bg-red-500 {
  background-color: #ef4444;
}

.text-red-600 {
  color: #dc2626;
}

.text-green-600 {
  color: #059669;
}

.text-yellow-600 {
  color: #d97706;
}

.text-gray-900 {
  color: #111827;
}

.restart-count {
  font-weight: 600;
  font-size: 0.75rem;
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
</style>