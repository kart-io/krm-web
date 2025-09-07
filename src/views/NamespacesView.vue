<script setup lang="ts">
import { ref } from 'vue'
import UniversalTable from '@/components/table/UniversalTable.vue'
import type { SearchField, TableColumn, TableAction } from '@/components/table/UniversalTable.vue'

// 定义命名空间数据类型
interface NamespaceData {
  id: string
  name: string
  cluster: string
  status: 'Active' | 'Terminating' | 'Failed'
  age: string
  pods: number
  services: number
  resourceQuota?: string
  limits?: string
}

// 搜索字段配置
const searchFields: SearchField[] = [
  {
    key: 'name',
    label: '命名空间名称',
    type: 'input',
    placeholder: '请输入命名空间名称'
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
      { label: 'Active', value: 'Active' },
      { label: 'Terminating', value: 'Terminating' },
      { label: 'Failed', value: 'Failed' }
    ]
  }
]

// 表格列配置
const columns: TableColumn[] = [
  {
    field: 'name',
    title: '命名空间名称',
    minWidth: 200,
    slot: 'namespace-info',
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
    field: 'pods',
    title: 'Pod数量',
    width: 100,
    align: 'center',
    slot: 'pod-count',
    sortable: true
  },
  {
    field: 'services',
    title: 'Service数量',
    width: 120,
    align: 'center',
    slot: 'service-count',
    sortable: true
  },
  {
    field: 'resourceQuota',
    title: '资源配额',
    width: 120,
    align: 'center',
    slot: 'resource-quota'
  },
  {
    field: 'limits',
    title: '资源限制',
    width: 120,
    align: 'center',
    slot: 'resource-limits'
  }
]

// 操作按钮配置
const actions: TableAction[] = [
  { key: 'view', label: '查看', type: 'info' },
  { key: 'edit', label: '编辑', type: 'primary' },
  { key: 'delete', label: '删除', type: 'danger' }
]

// 模拟命名空间数据
const tableData = ref<NamespaceData[]>([
  { 
    id: '1', 
    name: 'default', 
    cluster: 'production',
    status: 'Active', 
    age: '30d', 
    pods: 15, 
    services: 8,
    resourceQuota: '4Gi/8Gi',
    limits: '2CPU/4CPU'
  },
  { 
    id: '2', 
    name: 'kube-system', 
    cluster: 'production',
    status: 'Active', 
    age: '30d', 
    pods: 12, 
    services: 6,
    resourceQuota: '2Gi/4Gi',
    limits: '1CPU/2CPU'
  },
  { 
    id: '3', 
    name: 'monitoring', 
    cluster: 'production',
    status: 'Active', 
    age: '20d', 
    pods: 8, 
    services: 4,
    resourceQuota: '1Gi/2Gi',
    limits: '500m/1CPU'
  },
  { 
    id: '4', 
    name: 'staging-app', 
    cluster: 'staging',
    status: 'Active', 
    age: '15d', 
    pods: 6, 
    services: 3,
    resourceQuota: '1Gi/2Gi',
    limits: '500m/1CPU'
  },
  { 
    id: '5', 
    name: 'database', 
    cluster: 'staging',
    status: 'Active', 
    age: '12d', 
    pods: 3, 
    services: 2,
    resourceQuota: '2Gi/4Gi',
    limits: '1CPU/2CPU'
  },
  { 
    id: '6', 
    name: 'dev-app', 
    cluster: 'development',
    status: 'Active', 
    age: '8d', 
    pods: 4, 
    services: 2,
    resourceQuota: '512Mi/1Gi',
    limits: '250m/500m'
  },
  { 
    id: '7', 
    name: 'test-env', 
    cluster: 'development',
    status: 'Active', 
    age: '5d', 
    pods: 2, 
    services: 1,
    resourceQuota: '256Mi/512Mi',
    limits: '100m/250m'
  }
])

// 模拟API方法
const fetchNamespaces = async (params: Record<string, any>) => {
  console.log('调用API获取命名空间数据:', params)
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
  console.log('添加命名空间')
}

const handleAction = (actionKey: string, row: NamespaceData) => {
  console.log(`执行操作: ${actionKey}`, row)
  switch (actionKey) {
    case 'view':
      viewNamespace(row)
      break
    case 'edit':
      editNamespace(row)
      break
    case 'delete':
      deleteNamespace(row)
      break
  }
}

// 选择处理
const handleSelectionChange = (selection: NamespaceData[]) => {
  console.log('选择变化:', selection)
}

const handleSelectAll = (selection: NamespaceData[]) => {
  console.log('全选变化:', selection)
}

// 操作函数
const viewNamespace = (row: NamespaceData) => {
  console.log('查看命名空间:', row)
}

const editNamespace = (row: NamespaceData) => {
  console.log('编辑命名空间:', row)
}

const deleteNamespace = (row: NamespaceData) => {
  console.log('删除命名空间:', row)
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Active': return 'status-active'
    case 'Terminating': return 'status-terminating'
    case 'Failed': return 'status-failed'
    default: return 'status-default'
  }
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
    title="命名空间管理"
    :table-data="tableData"
    :columns="columns"
    :search-fields="searchFields"
    :actions="actions"
    add-button-text="添加命名空间"
    :api-method="fetchNamespaces"
    :show-checkbox="true"
    :show-seq-number="true"
    @search="handleSearch"
    @reset="handleReset"
    @add="handleAdd"
    @action="handleAction"
    @selection-change="handleSelectionChange"
    @select-all="handleSelectAll"
  >
    <!-- 自定义命名空间名称列 -->
    <template #namespace-info="{ row }">
      <div class="namespace-info">
        <div class="namespace-name">{{ row.name }}</div>
        <div class="namespace-age">{{ row.age }}</div>
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
      <span class="status-badge" :class="getStatusClass(row.status)">
        {{ row.status }}
      </span>
    </template>

    <!-- 自定义Pod数量列 -->
    <template #pod-count="{ row }">
      <span class="resource-count pods">{{ row.pods }}</span>
    </template>

    <!-- 自定义Service数量列 -->
    <template #service-count="{ row }">
      <span class="resource-count services">{{ row.services }}</span>
    </template>

    <!-- 自定义资源配额列 -->
    <template #resource-quota="{ row }">
      <code v-if="row.resourceQuota" class="quota-text">{{ row.resourceQuota }}</code>
      <span v-else class="no-quota">未设置</span>
    </template>

    <!-- 自定义资源限制列 -->
    <template #resource-limits="{ row }">
      <code v-if="row.limits" class="limits-text">{{ row.limits }}</code>
      <span v-else class="no-limits">未设置</span>
    </template>
  </UniversalTable>
</template>

<style scoped>
/* 命名空间相关样式 */
.namespace-info {
  padding: 0.5rem 0;
}

.namespace-name {
  font-weight: 600;
  color: #1f2937;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.namespace-age {
  font-size: 0.625rem;
  color: #6b7280;
}

.cluster-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.cluster-production {
  background: #fef3c7;
  color: #92400e;
}

.cluster-staging {
  background: #dbeafe;
  color: #1e40af;
}

.cluster-development {
  background: #d1fae5;
  color: #065f46;
}

.cluster-default {
  background: #f3f4f6;
  color: #374151;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-terminating {
  background: #fef3c7;
  color: #92400e;
}

.status-failed {
  background: #fee2e2;
  color: #991b1b;
}

.status-default {
  background: #f3f4f6;
  color: #374151;
}

.resource-count {
  font-weight: 600;
  font-size: 0.875rem;
}

.resource-count.pods {
  color: #3b82f6;
}

.resource-count.services {
  color: #10b981;
}

.quota-text, .limits-text {
  background: #f3f4f6;
  color: #1f2937;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.625rem;
}

.no-quota, .no-limits {
  color: #9ca3af;
  font-size: 0.75rem;
}
</style>