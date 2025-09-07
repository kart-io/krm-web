<template>
  <UniversalTable
    title="集群管理"
    :table-data="tableData"
    :columns="columns"
    :search-fields="searchFields"
    :actions="actions"
    add-button-text="添加集群"
    :api-method="fetchClusters"
    :show-checkbox="true"
    :show-seq-number="true"
    @search="handleSearch"
    @reset="handleReset"
    @add="handleAdd"
    @action="handleAction"
    @selection-change="handleSelectionChange"
    @select-all="handleSelectAll"
  >
    <!-- 自定义集群名称列 -->
    <template #cluster-info="{ row }">
      <div class="cluster-info">
        <div class="cluster-name">{{ row.name }}</div>
        <div class="cluster-endpoint">{{ row.endpoint }}</div>
      </div>
    </template>

    <!-- 自定义状态列 -->
    <template #status="{ row }">
      <span class="status-badge" :class="`status-${row.status}`">
        {{ getStatusText(row.status) }}
      </span>
    </template>

    <!-- 自定义连接方式列 -->
    <template #connection-type="{ row }">
      {{ getConnectionLabel(row.connectionType) }}
    </template>

    <!-- 自定义CPU使用率列 -->
    <template #cpu="{ row }">
      <div class="resource-item">
        <span class="resource-text">{{ row.cpu }}%</span>
        <div class="progress">
          <div class="progress-bar" :style="{ width: row.cpu + '%' }"></div>
        </div>
      </div>
    </template>

    <!-- 自定义内存使用率列 -->
    <template #memory="{ row }">
      <div class="resource-item">
        <span class="resource-text">{{ row.memory }}%</span>
        <div class="progress">
          <div class="progress-bar memory" :style="{ width: row.memory + '%' }"></div>
        </div>
      </div>
    </template>
  </UniversalTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UniversalTable from '@/components/table/UniversalTable.vue'
import type { SearchField, TableColumn, TableAction } from '@/components/table/UniversalTable.vue'

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

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    key: 'name',
    label: '集群名称',
    type: 'input',
    placeholder: '请输入集群名称'
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '健康', value: 'healthy' },
      { label: '警告', value: 'warning' },
      { label: '错误', value: 'error' }
    ]
  }
]

// 表格列配置
const columns: TableColumn[] = [
  {
    field: 'name',
    title: '集群名称',
    minWidth: 200,
    slot: 'cluster-info',
    sortable: true
  },
  {
    field: 'status',
    title: '状态',
    width: 100,
    slot: 'status',
    sortable: true
  },
  {
    field: 'connectionType',
    title: '连接方式',
    width: 140,
    slot: 'connection-type',
    sortable: true
  },
  {
    field: 'version',
    title: '版本',
    width: 100,
    sortable: true
  },
  {
    field: 'nodes',
    title: '节点数',
    width: 80,
    align: 'center',
    sortable: true
  },
  {
    field: 'pods',
    title: 'POD数',
    width: 80,
    align: 'center',
    sortable: true
  },
  {
    field: 'cpu',
    title: 'CPU使用率',
    width: 120,
    align: 'center',
    slot: 'cpu',
    sortable: true
  },
  {
    field: 'memory',
    title: '内存使用率',
    width: 120,
    align: 'center',
    slot: 'memory',
    sortable: true
  },
  {
    field: 'created',
    title: '创建时间',
    width: 120,
    sortable: true
  }
]

// 操作按钮配置
const actions: TableAction[] = [
  { key: 'view', label: '查看', type: 'info' },
  { key: 'edit', label: '编辑', type: 'primary' },
  { key: 'delete', label: '删除', type: 'danger' }
]

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

// 模拟API方法
const fetchClusters = async (params: Record<string, any>) => {
  console.log('调用API获取集群数据:', params)
  // 这里可以调用真实的API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: tableData.value })
    }, 1000)
  })
}

// 事件处理
const handleSearch = (params: Record<string, any>) => {
  console.log('搜索参数:', params)
}

const handleReset = () => {
  console.log('重置搜索条件')
}

const handleAdd = () => {
  console.log('添加集群')
}

const handleAction = (actionKey: string, row: ClusterData) => {
  console.log(`执行操作: ${actionKey}`, row)
  switch (actionKey) {
    case 'view':
      viewCluster(row)
      break
    case 'edit':
      editCluster(row)
      break
    case 'delete':
      deleteCluster(row)
      break
  }
}

// 选择处理
const handleSelectionChange = (selection: ClusterData[]) => {
  console.log('选择变化:', selection)
}

const handleSelectAll = (selection: ClusterData[]) => {
  console.log('全选变化:', selection)
}

// 操作函数
const viewCluster = (row: ClusterData) => {
  console.log('查看集群:', row)
}

const editCluster = (row: ClusterData) => {
  console.log('编辑集群:', row)
}

const deleteCluster = (row: ClusterData) => {
  console.log('删除集群:', row)
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
</script>

<style scoped>
/* 集群相关样式 */
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
</style>