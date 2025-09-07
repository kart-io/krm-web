<template>
  <div class="clusters-view">
    <div class="container">

      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-fields">
          <div class="search-field-inline">
            <label>集群名称：</label>
            <input
              v-model="searchClusterName"
              type="text"
              placeholder="请输入集群名称"
              class="search-input"
            />
          </div>
          <div class="search-field-inline">
            <label>状态：</label>
            <select v-model="selectedStatus" class="search-select">
              <option value="">请选择</option>
              <option value="healthy">健康</option>
              <option value="warning">警告</option>
              <option value="error">错误</option>
            </select>
          </div>
        </div>
        <div class="search-actions">
          <button @click="resetSearch" class="btn-secondary">重置</button>
          <button @click="handleSearch" class="btn-primary">查询</button>
        </div>
      </div>

      <!-- 标题和操作区域 -->
      <div class="title-section">
        <h2 class="page-title">集群管理</h2>
        <button @click="addCluster" class="btn-primary">
          添加集群
        </button>
      </div>

      <div class="table-wrapper">
        <vxe-table 
          :data="tableData" 
          border 
          stripe
          height="500"
          size="mini"
          show-overflow="tooltip"
        >
          <vxe-column type="seq" title="序号" width="60"></vxe-column>
          
          <vxe-column field="name" title="集群名称" min-width="200">
            <template #default="{ row }">
              <div class="cluster-info">
                <div class="cluster-name">{{ row.name }}</div>
                <div class="cluster-endpoint">{{ row.endpoint }}</div>
              </div>
            </template>
          </vxe-column>
          
          <vxe-column field="status" title="状态" width="100">
            <template #default="{ row }">
              <span class="status-badge" :class="`status-${row.status}`">
                {{ getStatusText(row.status) }}
              </span>
            </template>
          </vxe-column>
          
          <vxe-column field="connectionType" title="连接方式" width="140">
            <template #default="{ row }">
              {{ getConnectionLabel(row.connectionType) }}
            </template>
          </vxe-column>
          
          <vxe-column field="version" title="版本" width="100"></vxe-column>
          <vxe-column field="nodes" title="节点数" width="80" align="center"></vxe-column>
          <vxe-column field="pods" title="POD数" width="80" align="center"></vxe-column>
          
          <vxe-column title="CPU使用率" width="120" align="center">
            <template #default="{ row }">
              <div class="resource-item">
                <span class="resource-text">{{ row.cpu }}%</span>
                <div class="progress">
                  <div class="progress-bar" :style="{ width: row.cpu + '%' }"></div>
                </div>
              </div>
            </template>
          </vxe-column>
          
          <vxe-column title="内存使用率" width="120" align="center">
            <template #default="{ row }">
              <div class="resource-item">
                <span class="resource-text">{{ row.memory }}%</span>
                <div class="progress">
                  <div class="progress-bar memory" :style="{ width: row.memory + '%' }"></div>
                </div>
              </div>
            </template>
          </vxe-column>
          
          <vxe-column field="created" title="创建时间" width="120"></vxe-column>
          
          <vxe-column title="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="actions">
                <button @click="viewCluster(row)" class="btn btn-info">查看</button>
                <button @click="editCluster(row)" class="btn btn-primary">编辑</button>
                <button @click="deleteCluster(row)" class="btn btn-danger">删除</button>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'


// 搜索相关的响应式数据
const searchClusterName = ref('')
const selectedStatus = ref('')

// 定义数据类型
interface ClusterData {
  id: string
  name: string
  status: 'healthy' | 'warning' | 'error'
  version: string
  nodes: number
  pods: number
  cpu: number
  memory: number
  created: string
  connectionType: 'kubeconfig' | 'token' | 'certificate' | 'cloud'
  endpoint: string
}

// 表格数据
const tableData = ref<ClusterData[]>([
  {
    id: '1',
    name: 'production',
    status: 'healthy',
    version: 'v1.28.2',
    nodes: 15,
    pods: 42,
    cpu: 65,
    memory: 78,
    created: '2024-01-15',
    connectionType: 'kubeconfig',
    endpoint: 'https://prod-k8s.example.com:6443'
  },
  {
    id: '2',
    name: 'staging',
    status: 'warning',
    version: 'v1.27.8',
    nodes: 3,
    pods: 12,
    cpu: 45,
    memory: 52,
    created: '2024-02-20',
    connectionType: 'token',
    endpoint: 'https://staging-k8s.example.com:6443'
  },
  {
    id: '3',
    name: 'development',
    status: 'healthy',
    version: 'v1.28.2',
    nodes: 2,
    pods: 8,
    cpu: 23,
    memory: 31,
    created: '2024-03-10',
    connectionType: 'certificate',
    endpoint: 'https://dev-k8s.example.com:6443'
  }
])

// 搜索相关函数
const handleSearch = () => {
  console.log('搜索', { 
    clusterName: searchClusterName.value, 
    status: selectedStatus.value 
  })
}

const resetSearch = () => {
  searchClusterName.value = ''
  selectedStatus.value = ''
  console.log('重置搜索条件')
}

// 工具函数
const getStatusText = (status: string) => {
  switch (status) {
    case 'healthy': return '健康'
    case 'warning': return '警告'
    case 'error': return '错误'
    default: return status
  }
}

const getConnectionLabel = (type: string) => {
  switch (type) {
    case 'kubeconfig': return 'Kubeconfig'
    case 'token': return 'Service Account Token'
    case 'certificate': return 'Client Certificate'
    case 'cloud': return 'Cloud Provider'
    default: return type
  }
}


// 操作函数
const addCluster = () => {
  console.log('添加集群')
}

const viewCluster = (row: ClusterData) => {
  console.log('查看集群:', row)
}

const editCluster = (row: ClusterData) => {
  console.log('编辑集群:', row)
}

const deleteCluster = (row: ClusterData) => {
  console.log('删除集群:', row)
}

</script>

<style scoped>
.clusters-view {
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100vh;
}

.container {
  max-width: 1600px;
  margin: 0 auto;
}

/* 搜索区域样式 */
.search-section {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: end;
}

.search-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
}

.search-field-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-field-inline label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
  white-space: nowrap;
  min-width: auto;
}

.search-input,
.search-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  width: 200px;
  height: 36px;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus,
.search-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.search-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  height: 36px;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* 标题区域样式 */
.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.page-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.table-wrapper {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 集群表格内容样式 */
.cluster-info {
  padding: 0.5rem 0;
}

.cluster-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.cluster-endpoint {
  font-size: 0.75rem;
  color: #6b7280;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-healthy {
  background: #dcfce7;
  color: #166534;
}

.status-warning {
  background: #fef3c7;
  color: #92400e;
}

.status-error {
  background: #fee2e2;
  color: #991b1b;
}

.resource-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0;
}

.resource-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
}

.progress {
  width: 80px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #10b981;
  transition: width 0.3s;
}

.progress-bar.memory {
  background: #3b82f6;
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

/* VxeTable 样式覆盖 */
:deep(.vxe-table) {
  font-size: 0.875rem;
  border-radius: 0.5rem;
  overflow: hidden;
}

:deep(.vxe-table .vxe-header--row .vxe-header--column) {
  background: #f1f5f9;
  color: #1e293b;
  font-weight: 600;
  font-size: 0.75rem;
  text-align: center;
  border-bottom: 2px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  padding: 0.75rem 0.5rem;
}

:deep(.vxe-table .vxe-body--row) {
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
}

:deep(.vxe-table .vxe-body--row:hover) {
  background: #f8fafc;
}

:deep(.vxe-table .vxe-body--row:nth-child(even)) {
  background-color: #fafbfc;
}

:deep(.vxe-table .vxe-body--column) {
  border-right: 1px solid #f3f4f6;
}

:deep(.vxe-table .vxe-cell) {
  padding: 0.75rem 0.5rem;
  font-size: 0.75rem;
  color: #475569;
  line-height: 1.5;
}


</style>