<script setup lang="ts">
import { ref } from 'vue'

interface Service {
  id: string
  name: string
  namespace: string
  type: 'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName'
  clusterIP: string
  externalIP: string
  ports: string[]
  age: string
  selector: Record<string, string>
  endpoints: number
}

const services = ref<Service[]>([
  {
    id: '1',
    name: 'nginx-service',
    namespace: 'default',
    type: 'LoadBalancer',
    clusterIP: '10.96.1.100',
    externalIP: '203.0.113.42',
    ports: ['80:30080/TCP', '443:30443/TCP'],
    age: '2d',
    selector: { app: 'nginx' },
    endpoints: 3
  },
  {
    id: '2',
    name: 'api-service',
    namespace: 'production',
    type: 'ClusterIP',
    clusterIP: '10.96.2.200',
    externalIP: '<none>',
    ports: ['8080/TCP'],
    age: '7d',
    selector: { app: 'api-server' },
    endpoints: 5
  },
  {
    id: '3',
    name: 'database-service',
    namespace: 'database',
    type: 'ClusterIP',
    clusterIP: '10.96.3.150',
    externalIP: '<none>',
    ports: ['5432/TCP'],
    age: '10d',
    selector: { app: 'postgres' },
    endpoints: 1
  },
  {
    id: '4',
    name: 'frontend-service',
    namespace: 'production',
    type: 'NodePort',
    clusterIP: '10.96.4.50',
    externalIP: '<none>',
    ports: ['80:32080/TCP'],
    age: '1d',
    selector: { app: 'frontend' },
    endpoints: 2
  },
  {
    id: '5',
    name: 'redis-service',
    namespace: 'default',
    type: 'ClusterIP',
    clusterIP: '10.96.5.75',
    externalIP: '<none>',
    ports: ['6379/TCP'],
    age: '5d',
    selector: { app: 'redis' },
    endpoints: 3
  },
  {
    id: '6',
    name: 'monitoring-service',
    namespace: 'kube-system',
    type: 'ExternalName',
    clusterIP: '<none>',
    externalIP: '<none>',
    ports: ['<none>'],
    age: '15d',
    selector: {},
    endpoints: 0
  }
])

// 操作函数
const addService = () => {
  console.log('添加服务')
}

const viewService = (row: Service) => {
  console.log('查看服务:', row)
}

const editService = (row: Service) => {
  console.log('编辑服务:', row)
}

const deleteService = (row: Service) => {
  console.log('删除服务:', row)
}

const getServiceTypeClass = (type: string) => {
  switch (type) {
    case 'LoadBalancer': return 'type-loadbalancer'
    case 'NodePort': return 'type-nodeport'
    case 'ClusterIP': return 'type-clusterip'
    case 'ExternalName': return 'type-external'
    default: return ''
  }
}

const getServiceTypeIcon = (type: string) => {
  switch (type) {
    case 'LoadBalancer': return '🌐'
    case 'NodePort': return '🚪'
    case 'ClusterIP': return '🏠'
    case 'ExternalName': return '🔗'
    default: return '❓'
  }
}
</script>

<template>
  <div class="services-view">
    <div class="container">
      <div class="header">
        <div class="title-section">
          <h1 class="app-page-title">Kubernetes Services</h1>
          <p class="app-page-subtitle">Manage network access to your Kubernetes applications</p>
        </div>
        <div class="actions-section">
          <button @click="addService" class="btn-primary">
            添加服务
          </button>
        </div>
      </div>

      <div class="table-wrapper">
        <vxe-table 
          :data="services" 
          border="inner" 
          stripe
          height="600"
          size="mini"
          show-overflow="tooltip"
          :row-config="{ height: 32 }"
        >
          <vxe-column type="seq" title="序号" width="60"></vxe-column>
          
          <vxe-column field="name" title="服务名称" min-width="200">
            <template #default="{ row }">
              <div class="service-info">
                <div class="service-name">{{ row.name }}</div>
                <div class="service-namespace">{{ row.namespace }}</div>
              </div>
            </template>
          </vxe-column>
          
          <vxe-column field="type" title="类型" width="120">
            <template #default="{ row }">
              <div class="type-badge" :class="getServiceTypeClass(row.type)">
                <span class="type-icon">{{ getServiceTypeIcon(row.type) }}</span>
                <span class="type-name">{{ row.type }}</span>
              </div>
            </template>
          </vxe-column>
          
          <vxe-column field="clusterIP" title="集群IP" width="140">
            <template #default="{ row }">
              <code class="ip-address">{{ row.clusterIP }}</code>
            </template>
          </vxe-column>
          
          <vxe-column field="externalIP" title="外部IP" width="140">
            <template #default="{ row }">
              <code v-if="row.externalIP !== '<none>'" class="ip-address external">{{ row.externalIP }}</code>
              <span v-else class="no-external">{{ row.externalIP }}</span>
            </template>
          </vxe-column>
          
          <vxe-column field="ports" title="端口" width="180">
            <template #default="{ row }">
              <div class="ports-list">
                <span v-for="port in row.ports.slice(0, 2)" :key="port" class="port-tag">
                  {{ port }}
                </span>
                <span v-if="row.ports.length > 2" class="port-more">+{{ row.ports.length - 2 }}</span>
              </div>
            </template>
          </vxe-column>
          
          <vxe-column field="endpoints" title="端点数" width="80" align="center">
            <template #default="{ row }">
              <span class="endpoints-count" :class="{ 'no-endpoints': row.endpoints === 0 }">
                {{ row.endpoints }}
              </span>
            </template>
          </vxe-column>
          
          <vxe-column field="age" title="运行时长" width="100" align="center"></vxe-column>
          
          <vxe-column title="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="actions">
                <button @click="viewService(row)" class="btn btn-info">查看</button>
                <button @click="editService(row)" class="btn btn-primary">编辑</button>
                <button @click="deleteService(row)" class="btn btn-danger">删除</button>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.services-view {
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

.service-info {
  line-height: 1.2;
}

.service-name {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.75rem;
}

.service-namespace {
  font-size: 0.625rem;
  color: #9ca3af;
  margin-top: 2px;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 0.625rem;
  font-weight: 500;
  line-height: 1.2;
}

.type-loadbalancer {
  background: #3b82f6;
  color: #ffffff;
}

.type-nodeport {
  background: #10b981;
  color: #ffffff;
}

.type-clusterip {
  background: #6366f1;
  color: #ffffff;
}

.type-external {
  background: #8b5cf6;
  color: #ffffff;
}

.ip-address {
  background: #f9fafb;
  color: #374151;
  padding: 1px 4px;
  border-radius: 2px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.625rem;
  border: 1px solid #e5e7eb;
}

.ip-address.external {
  background: #dcfce7;
  color: #166534;
}

.no-external {
  color: #9ca3af;
  font-size: 0.75rem;
}

.ports-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: center;
}

.port-tag {
  background: #f1f5f9;
  color: #475569;
  padding: 1px 4px;
  border-radius: 2px;
  font-size: 0.625rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  margin-right: 2px;
}

.port-more {
  background: #e5e7eb;
  color: #6b7280;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.625rem;
  font-weight: 500;
}

.endpoints-count {
  font-weight: 500;
  font-size: 0.75rem;
  color: #10b981;
}

.endpoints-count.no-endpoints {
  color: #ef4444;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 2px 8px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.625rem;
  font-weight: 500;
  line-height: 1.2;
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