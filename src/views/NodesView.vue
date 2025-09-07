<script setup lang="ts">
import { ref } from 'vue'
import UniversalTable from '@/components/table/UniversalTable.vue'
import type { SearchField, TableColumn, TableAction } from '@/components/table/UniversalTable.vue'

// 定义节点数据类型
interface NodeData {
  id: string
  name: string
  cluster: string
  status: 'Ready' | 'NotReady'
  roles: string[]
  age: string
  version: string
  cpu: string
  memory: string
  cpuUsage: number
  memoryUsage: number
}

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    key: 'name',
    label: '节点名称',
    type: 'input',
    placeholder: '请输入节点名称'
  },
  {
    key: 'cluster',
    label: '所属集群',
    type: 'select',
    options: [
      { label: 'production', value: 'production' },
      { label: 'staging', value: 'staging' },
      { label: 'development', value: 'development' }
    ]
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: 'Ready', value: 'Ready' },
      { label: 'NotReady', value: 'NotReady' }
    ]
  }
]

// 表格列配置
const columns: TableColumn[] = [
  {
    field: 'name',
    title: '节点名称',
    minWidth: 200,
    slot: 'node-info',
    sortable: true
  },
  {
    field: 'cluster',
    title: '所属集群',
    width: 140,
    align: 'center',
    slot: 'cluster-badge',
    sortable: true
  },
  {
    field: 'status',
    title: '状态',
    width: 100,
    align: 'center',
    slot: 'status-badge',
    sortable: true
  },
  {
    field: 'roles',
    title: '角色',
    width: 180,
    slot: 'roles-list'
  },
  {
    field: 'version',
    title: '版本',
    width: 120,
    align: 'center',
    slot: 'version-text',
    sortable: true
  },
  {
    field: 'cpuUsage',
    title: 'CPU使用率',
    width: 140,
    align: 'center',
    slot: 'cpu-usage',
    sortable: true
  },
  {
    field: 'memoryUsage',
    title: '内存使用率',
    width: 140,
    align: 'center',
    slot: 'memory-usage',
    sortable: true
  },
  {
    field: 'age',
    title: '运行时长',
    width: 100,
    align: 'center',
    sortable: true
  }
]

// 操作按钮配置
const actions: TableAction[] = [
  { key: 'view', label: '查看', type: 'info' },
  { key: 'edit', label: '编辑', type: 'primary' },
  { key: 'delete', label: '删除', type: 'danger' }
]

// 模拟节点数据
const tableData = ref<NodeData[]>([
  {
    id: '1',
    name: 'master-node',
    cluster: 'production',
    status: 'Ready',
    roles: ['control-plane', 'master'],
    age: '30d',
    version: 'v1.28.2',
    cpu: '4 cores',
    memory: '16Gi',
    cpuUsage: 35,
    memoryUsage: 45
  },
  {
    id: '2',
    name: 'worker-node-1',
    cluster: 'production',
    status: 'Ready',
    roles: ['worker'],
    age: '25d',
    version: 'v1.28.2',
    cpu: '8 cores',
    memory: '32Gi',
    cpuUsage: 68,
    memoryUsage: 72
  },
  {
    id: '3',
    name: 'worker-node-2', 
    cluster: 'production',
    status: 'Ready',
    roles: ['worker'],
    age: '20d',
    version: 'v1.28.2',
    cpu: '8 cores',
    memory: '32Gi',
    cpuUsage: 45,
    memoryUsage: 38
  },
  {
    id: '4',
    name: 'staging-master',
    cluster: 'staging',
    status: 'Ready',
    roles: ['control-plane', 'master'],
    age: '15d',
    version: 'v1.27.8',
    cpu: '2 cores',
    memory: '8Gi',
    cpuUsage: 25,
    memoryUsage: 35
  },
  {
    id: '5',
    name: 'staging-worker-1',
    cluster: 'staging',
    status: 'Ready',
    roles: ['worker'],
    age: '15d',
    version: 'v1.27.8',
    cpu: '4 cores',
    memory: '16Gi',
    cpuUsage: 40,
    memoryUsage: 50
  },
  {
    id: '6',
    name: 'dev-master',
    cluster: 'development',
    status: 'Ready',
    roles: ['control-plane', 'master'],
    age: '10d',
    version: 'v1.28.2',
    cpu: '2 cores',
    memory: '4Gi',
    cpuUsage: 15,
    memoryUsage: 25
  },
  {
    id: '7',
    name: 'dev-worker-1',
    cluster: 'development',
    status: 'Ready',
    roles: ['worker'],
    age: '10d',
    version: 'v1.28.2',
    cpu: '2 cores',
    memory: '8Gi',
    cpuUsage: 30,
    memoryUsage: 40
  }
])

// 模拟API方法
const fetchNodes = async (params: Record<string, any>) => {
  console.log('调用API获取节点数据:', params)
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
  console.log('添加节点')
}

const handleAction = (actionKey: string, row: NodeData) => {
  console.log(`执行操作: ${actionKey}`, row)
  switch (actionKey) {
    case 'view':
      viewNode(row)
      break
    case 'edit':
      editNode(row)
      break
    case 'delete':
      deleteNode(row)
      break
  }
}

// 选择处理
const handleSelectionChange = (selection: NodeData[]) => {
  console.log('选择变化:', selection)
}

const handleSelectAll = (selection: NodeData[]) => {
  console.log('全选变化:', selection)
}

// 操作函数
const viewNode = (row: NodeData) => {
  console.log('查看节点:', row)
}

const editNode = (row: NodeData) => {
  console.log('编辑节点:', row)
}

const deleteNode = (row: NodeData) => {
  console.log('删除节点:', row)
}

const getUsageColor = (usage: number) => {
  if (usage > 80) return 'text-red-600'
  if (usage > 60) return 'text-yellow-600'
  return 'text-green-600'
}

const getClusterClass = (cluster: string) => {
  switch (cluster) {
    case 'production': return 'cluster-production'
    case 'staging': return 'cluster-staging'
    case 'development': return 'cluster-development'
    default: return 'cluster-default'
  }
}
</script>

<template>
  <UniversalTable
    title="节点管理"
    :table-data="tableData"
    :columns="columns"
    :search-fields="searchFields"
    :actions="actions"
    add-button-text="添加节点"
    :api-method="fetchNodes"
    :show-checkbox="true"
    :show-seq-number="true"
    @search="handleSearch"
    @reset="handleReset"
    @add="handleAdd"
    @action="handleAction"
    @selection-change="handleSelectionChange"
    @select-all="handleSelectAll"
  >
    <!-- 自定义节点名称列 -->
    <template #node-info="{ row }">
      <div class="node-info">
        <div class="flex items-center">
          <div class="status-dot" :class="row.status === 'Ready' ? 'ready' : 'not-ready'"></div>
          <div class="node-name">{{ row.name }}</div>
        </div>
      </div>
    </template>

    <!-- 自定义集群列 -->
    <template #cluster-badge="{ row }">
      <span class="cluster-badge" :class="getClusterClass(row.cluster)">
        {{ row.cluster }}
      </span>
    </template>

    <!-- 自定义状态列 -->
    <template #status-badge="{ row }">
      <span class="status-badge" :class="row.status === 'Ready' ? 'status-ready' : 'status-not-ready'">
        {{ row.status }}
      </span>
    </template>

    <!-- 自定义角色列 -->
    <template #roles-list="{ row }">
      <div class="roles-list">
        <span v-for="role in row.roles" :key="role" 
              class="role-tag" 
              :class="role === 'master' || role === 'control-plane' ? 'role-master' : 'role-worker'">
          {{ role }}
        </span>
      </div>
    </template>

    <!-- 自定义版本列 -->
    <template #version-text="{ row }">
      <code class="version-text">{{ row.version }}</code>
    </template>

    <!-- 自定义CPU使用率列 -->
    <template #cpu-usage="{ row }">
      <div class="usage-item">
        <span class="usage-text" :class="getUsageColor(row.cpuUsage)">{{ row.cpuUsage }}%</span>
        <div class="progress">
          <div class="progress-bar" 
               :class="{
                 'progress-green': row.cpuUsage <= 60,
                 'progress-yellow': row.cpuUsage > 60 && row.cpuUsage <= 80,
                 'progress-red': row.cpuUsage > 80
               }"
               :style="{ width: row.cpuUsage + '%' }">
          </div>
        </div>
      </div>
    </template>

    <!-- 自定义内存使用率列 -->
    <template #memory-usage="{ row }">
      <div class="usage-item">
        <span class="usage-text" :class="getUsageColor(row.memoryUsage)">{{ row.memoryUsage }}%</span>
        <div class="progress">
          <div class="progress-bar" 
               :class="{
                 'progress-green': row.memoryUsage <= 60,
                 'progress-yellow': row.memoryUsage > 60 && row.memoryUsage <= 80,
                 'progress-red': row.memoryUsage > 80
               }"
               :style="{ width: row.memoryUsage + '%' }">
          </div>
        </div>
      </div>
    </template>
  </UniversalTable>
</template>

<style scoped>
/* 节点相关样式 */
.node-info {
  padding: 0.5rem 0;
}

.node-name {
  font-weight: 600;
  color: #1f2937;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.75rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.75rem;
}

.status-dot.ready {
  background: #10b981;
}

.status-dot.not-ready {
  background: #ef4444;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 0.625rem;
  font-weight: 500;
  line-height: 1.2;
}

.status-ready {
  background: #10b981;
  color: #ffffff;
}

.status-not-ready {
  background: #ef4444;
  color: #ffffff;
}

.cluster-badge {
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 0.625rem;
  font-weight: 500;
  line-height: 1.2;
}

.cluster-production {
  background: #3b82f6;
  color: #ffffff;
}

.cluster-staging {
  background: #f59e0b;
  color: #ffffff;
}

.cluster-development {
  background: #10b981;
  color: #ffffff;
}

.cluster-default {
  background: #6b7280;
  color: #ffffff;
}

.roles-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.role-tag {
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 600;
}

.role-master {
  background: #f3e8ff;
  color: #7c3aed;
}

.role-worker {
  background: #dbeafe;
  color: #1e40af;
}

.version-text {
  background: #f3f4f6;
  color: #1f2937;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.75rem;
}

.usage-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0;
}

.usage-text {
  font-size: 0.75rem;
  font-weight: 600;
}

.usage-text.text-green-600 {
  color: #10b981;
}

.usage-text.text-yellow-600 {
  color: #f59e0b;
}

.usage-text.text-red-600 {
  color: #ef4444;
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
  transition: width 0.3s;
}

.progress-green {
  background: #10b981;
}

.progress-yellow {
  background: #f59e0b;
}

.progress-red {
  background: #ef4444;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}
</style>