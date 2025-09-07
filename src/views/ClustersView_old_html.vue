<script setup lang="ts">
import { ref, computed } from 'vue'

interface Cluster {
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

interface NewCluster {
  name: string
  connectionType: 'kubeconfig' | 'token' | 'certificate' | 'cloud'
  endpoint: string
  kubeconfigFile?: File | null
  kubeconfigContent?: string
  token?: string
  caCert?: string
  clientCert?: string
  clientKey?: string
  cloudProvider?: 'aws' | 'gcp' | 'azure'
  cloudConfig?: any
}

const clusters = ref<Cluster[]>([
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

const selectedCluster = ref<Cluster | null>(null)
const showAddModal = ref(false)
const showDeleteConfirm = ref(false)
const clusterToDelete = ref<Cluster | null>(null)

const newCluster = ref<NewCluster>({
  name: '',
  connectionType: 'kubeconfig',
  endpoint: '',
  kubeconfigFile: null,
  kubeconfigContent: '',
  token: '',
  caCert: '',
  clientCert: '',
  clientKey: '',
  cloudProvider: 'aws',
  cloudConfig: {}
})

const selectedClusters = ref<Set<string>>(new Set())

const selectCluster = (cluster: Cluster) => {
  selectedCluster.value = cluster
}

const closeModal = () => {
  selectedCluster.value = null
}

const openAddModal = () => {
  showAddModal.value = true
  resetNewCluster()
}

const closeAddModal = () => {
  showAddModal.value = false
  resetNewCluster()
}

const resetNewCluster = () => {
  newCluster.value = {
    name: '',
    connectionType: 'kubeconfig',
    endpoint: '',
    kubeconfigFile: null,
    kubeconfigContent: '',
    token: '',
    caCert: '',
    clientCert: '',
    clientKey: '',
    cloudProvider: 'aws',
    cloudConfig: {}
  }
}

const handleKubeconfigUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    newCluster.value.kubeconfigFile = file
    const reader = new FileReader()
    reader.onload = (e) => {
      newCluster.value.kubeconfigContent = e.target?.result as string
    }
    reader.readAsText(file)
  }
}

const addCluster = () => {
  if (!newCluster.value.name || !newCluster.value.endpoint) {
    alert('请填写集群名称和端点地址')
    return
  }

  const cluster: Cluster = {
    id: Date.now().toString(),
    name: newCluster.value.name,
    status: 'healthy',
    version: 'v1.28.2',
    nodes: 0,
    pods: 0,
    cpu: 0,
    memory: 0,
    created: new Date().toISOString().split('T')[0],
    connectionType: newCluster.value.connectionType,
    endpoint: newCluster.value.endpoint
  }

  clusters.value.push(cluster)
  closeAddModal()
  
  console.log('Adding cluster:', cluster)
}

const confirmDelete = (cluster: Cluster) => {
  clusterToDelete.value = cluster
  showDeleteConfirm.value = true
}

const deleteCluster = () => {
  if (clusterToDelete.value) {
    const index = clusters.value.findIndex(c => c.id === clusterToDelete.value!.id)
    if (index > -1) {
      clusters.value.splice(index, 1)
    }
  }
  showDeleteConfirm.value = false
  clusterToDelete.value = null
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  clusterToDelete.value = null
}

const toggleClusterSelection = (clusterId: string) => {
  if (selectedClusters.value.has(clusterId)) {
    selectedClusters.value.delete(clusterId)
  } else {
    selectedClusters.value.add(clusterId)
  }
}

const selectAllClusters = (checked: boolean) => {
  if (checked) {
    clusters.value.forEach(cluster => selectedClusters.value.add(cluster.id))
  } else {
    selectedClusters.value.clear()
  }
}

const allSelected = computed(() => {
  return clusters.value.length > 0 && selectedClusters.value.size === clusters.value.length
})

const someSelected = computed(() => {
  return selectedClusters.value.size > 0 && selectedClusters.value.size < clusters.value.length
})

const deleteSelectedClusters = () => {
  if (selectedClusters.value.size === 0) return
  
  if (confirm(`确定要删除选中的 ${selectedClusters.value.size} 个集群吗？`)) {
    clusters.value = clusters.value.filter(cluster => !selectedClusters.value.has(cluster.id))
    selectedClusters.value.clear()
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'text-green-600 bg-green-100'
    case 'warning': return 'text-yellow-600 bg-yellow-100'
    case 'error': return 'text-red-600 bg-red-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

const getConnectionTypeLabel = (type: string) => {
  switch (type) {
    case 'kubeconfig': return 'Kubeconfig'
    case 'token': return 'Service Account Token'
    case 'certificate': return 'Client Certificate'
    case 'cloud': return 'Cloud Provider'
    default: return type
  }
}
</script>

<template>
  <div class="clusters-view">
    <div class="container">
      <div class="header">
        <div class="title-section">
          <h1 class="app-page-title">Kubernetes Clusters</h1>
          <p class="app-page-subtitle">Manage and monitor your Kubernetes clusters</p>
        </div>
        <div class="actions-section">
          <button 
            v-if="selectedClusters.size > 0"
            @click="deleteSelectedClusters"
            class="btn-danger"
          >
            删除选中 ({{ selectedClusters.size }})
          </button>
          <button @click="openAddModal" class="btn-primary">
            添加集群
          </button>
        </div>
      </div>

      <div class="table-container">
        <table class="clusters-table">
          <thead>
            <tr>
              <th class="checkbox-column">
                <input 
                  type="checkbox" 
                  :checked="allSelected"
                  :indeterminate="someSelected"
                  @change="selectAllClusters(($event.target as HTMLInputElement).checked)"
                  class="cluster-checkbox"
                />
              </th>
              <th class="name-column">集群名称</th>
              <th class="status-column">状态</th>
              <th class="connection-column">连接方式</th>
              <th class="version-column">版本</th>
              <th class="nodes-column">节点数</th>
              <th class="pods-column">Pod数</th>
              <th class="resources-column">资源使用</th>
              <th class="created-column">创建时间</th>
              <th class="actions-column">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="cluster in clusters" 
              :key="cluster.id"
              class="cluster-row"
              :class="{ 'selected': selectedClusters.has(cluster.id) }"
            >
              <td class="checkbox-column">
                <input 
                  type="checkbox" 
                  :checked="selectedClusters.has(cluster.id)"
                  @change="toggleClusterSelection(cluster.id)"
                  class="cluster-checkbox"
                />
              </td>
              <td class="name-column">
                <div class="cluster-name" @click="selectCluster(cluster)">
                  <span class="app-value font-semibold">{{ cluster.name }}</span>
                  <span class="app-label block text-gray-500">{{ cluster.endpoint }}</span>
                </div>
              </td>
              <td class="status-column">
                <span class="status-badge" :class="getStatusColor(cluster.status)">
                  {{ cluster.status }}
                </span>
              </td>
              <td class="connection-column">
                <span class="app-value">{{ getConnectionTypeLabel(cluster.connectionType) }}</span>
              </td>
              <td class="version-column">
                <span class="app-value">{{ cluster.version }}</span>
              </td>
              <td class="nodes-column">
                <span class="app-value">{{ cluster.nodes }}</span>
              </td>
              <td class="pods-column">
                <span class="app-value">{{ cluster.pods }}</span>
              </td>
              <td class="resources-column">
                <div class="resource-usage">
                  <div class="usage-item">
                    <span class="usage-label">CPU</span>
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :style="{ width: cluster.cpu + '%' }"
                        :class="{
                          'high-usage': cluster.cpu > 80,
                          'medium-usage': cluster.cpu > 60 && cluster.cpu <= 80
                        }"
                      ></div>
                    </div>
                    <span class="usage-percent">{{ cluster.cpu }}%</span>
                  </div>
                  <div class="usage-item">
                    <span class="usage-label">MEM</span>
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :style="{ width: cluster.memory + '%' }"
                        :class="{
                          'high-usage': cluster.memory > 80,
                          'medium-usage': cluster.memory > 60 && cluster.memory <= 80
                        }"
                      ></div>
                    </div>
                    <span class="usage-percent">{{ cluster.memory }}%</span>
                  </div>
                </div>
              </td>
              <td class="created-column">
                <span class="app-value">{{ cluster.created }}</span>
              </td>
              <td class="actions-column">
                <div class="action-buttons">
                  <button @click="selectCluster(cluster)" class="btn-secondary btn-sm">
                    查看
                  </button>
                  <button @click="confirmDelete(cluster)" class="btn-danger btn-sm">
                    删除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Cluster Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
      <div class="modal add-cluster-modal" @click.stop>
        <div class="modal-header">
          <h2 class="app-modal-title">添加 Kubernetes 集群</h2>
          <button class="close-btn" @click="closeAddModal">×</button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="addCluster" class="add-cluster-form">
            <!-- 基本信息 -->
            <div class="form-section">
              <h3 class="section-title">基本信息</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">集群名称 *</label>
                  <input 
                    v-model="newCluster.name" 
                    type="text" 
                    class="form-input" 
                    placeholder="输入集群名称"
                    required
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">集群端点 *</label>
                  <input 
                    v-model="newCluster.endpoint" 
                    type="text" 
                    class="form-input" 
                    placeholder="https://your-cluster-endpoint:6443"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- 连接方式 -->
            <div class="form-section">
              <h3 class="section-title">连接方式</h3>
              <div class="connection-tabs">
                <button 
                  type="button"
                  v-for="type in ['kubeconfig', 'token', 'certificate', 'cloud']" 
                  :key="type"
                  class="tab-button"
                  :class="{ 'active': newCluster.connectionType === type }"
                  @click="newCluster.connectionType = type"
                >
                  {{ getConnectionTypeLabel(type) }}
                </button>
              </div>

              <!-- Kubeconfig 方式 -->
              <div v-if="newCluster.connectionType === 'kubeconfig'" class="connection-config">
                <div class="form-group">
                  <label class="form-label">上传 Kubeconfig 文件</label>
                  <input 
                    type="file" 
                    @change="handleKubeconfigUpload" 
                    accept=".yaml,.yml,.config"
                    class="file-input"
                  />
                  <p class="form-hint">选择您的 kubeconfig 文件</p>
                </div>
                <div class="form-group" v-if="newCluster.kubeconfigContent">
                  <label class="form-label">或直接粘贴 Kubeconfig 内容</label>
                  <textarea 
                    v-model="newCluster.kubeconfigContent" 
                    class="form-textarea" 
                    rows="8"
                    placeholder="粘贴 kubeconfig 文件内容..."
                  ></textarea>
                </div>
              </div>

              <!-- Service Account Token 方式 -->
              <div v-if="newCluster.connectionType === 'token'" class="connection-config">
                <div class="form-group">
                  <label class="form-label">Service Account Token *</label>
                  <textarea 
                    v-model="newCluster.token" 
                    class="form-textarea" 
                    rows="4"
                    placeholder="输入 Service Account Token..."
                  ></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">CA 证书 (可选)</label>
                  <textarea 
                    v-model="newCluster.caCert" 
                    class="form-textarea" 
                    rows="6"
                    placeholder="输入 CA 证书内容..."
                  ></textarea>
                </div>
              </div>

              <!-- Client Certificate 方式 -->
              <div v-if="newCluster.connectionType === 'certificate'" class="connection-config">
                <div class="form-group">
                  <label class="form-label">客户端证书 *</label>
                  <textarea 
                    v-model="newCluster.clientCert" 
                    class="form-textarea" 
                    rows="6"
                    placeholder="输入客户端证书内容..."
                  ></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">私钥 *</label>
                  <textarea 
                    v-model="newCluster.clientKey" 
                    class="form-textarea" 
                    rows="6"
                    placeholder="输入客户端私钥内容..."
                  ></textarea>
                </div>
              </div>

              <!-- Cloud Provider 方式 -->
              <div v-if="newCluster.connectionType === 'cloud'" class="connection-config">
                <div class="form-group">
                  <label class="form-label">云服务提供商</label>
                  <select v-model="newCluster.cloudProvider" class="form-select">
                    <option value="aws">Amazon EKS</option>
                    <option value="gcp">Google GKE</option>
                    <option value="azure">Azure AKS</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">认证配置</label>
                  <textarea 
                    v-model="newCluster.cloudConfig" 
                    class="form-textarea" 
                    rows="6"
                    placeholder="输入云服务认证配置..."
                  ></textarea>
                  <p class="form-hint">请参考相应云服务的文档配置认证信息</p>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="closeAddModal" class="btn-secondary">
                取消
              </button>
              <button type="submit" class="btn-primary">
                添加集群
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="cancelDelete">
      <div class="modal delete-modal" @click.stop>
        <div class="modal-header">
          <h2 class="app-modal-title">确认删除</h2>
          <button class="close-btn" @click="cancelDelete">×</button>
        </div>
        <div class="modal-content">
          <p class="delete-message">
            确定要删除集群 <strong>{{ clusterToDelete?.name }}</strong> 吗？
            <br/>
            此操作不可恢复。
          </p>
          <div class="form-actions">
            <button @click="cancelDelete" class="btn-secondary">
              取消
            </button>
            <button @click="deleteCluster" class="btn-danger">
              确认删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cluster Details Modal -->
    <div v-if="selectedCluster" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2 class="app-modal-title">{{ selectedCluster.name }} 集群详情</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-content">
          <div class="detail-grid">
            <div class="detail-item">
              <strong class="app-label">状态:</strong>
              <span class="status-badge" :class="getStatusColor(selectedCluster.status)">
                {{ selectedCluster.status }}
              </span>
            </div>
            <div class="detail-item">
              <strong class="app-label">连接方式:</strong>
              <span class="app-value">{{ getConnectionTypeLabel(selectedCluster.connectionType) }}</span>
            </div>
            <div class="detail-item">
              <strong class="app-label">端点地址:</strong>
              <span class="app-value">{{ selectedCluster.endpoint }}</span>
            </div>
            <div class="detail-item">
              <strong class="app-label">版本:</strong>
              <span class="app-value">{{ selectedCluster.version }}</span>
            </div>
            <div class="detail-item">
              <strong class="app-label">节点数:</strong>
              <span class="app-value">{{ selectedCluster.nodes }}</span>
            </div>
            <div class="detail-item">
              <strong class="app-label">Pod数:</strong>
              <span class="app-value">{{ selectedCluster.pods }}</span>
            </div>
            <div class="detail-item">
              <strong class="app-label">CPU使用率:</strong>
              <span class="app-value">{{ selectedCluster.cpu }}%</span>
            </div>
            <div class="detail-item">
              <strong class="app-label">内存使用率:</strong>
              <span class="app-value">{{ selectedCluster.memory }}%</span>
            </div>
            <div class="detail-item">
              <strong class="app-label">创建时间:</strong>
              <span class="app-value">{{ selectedCluster.created }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clusters-view {
  padding: 1.5rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.title-section h1 {
  margin-bottom: 0.25rem;
}

.actions-section {
  display: flex;
  gap: 0.75rem;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-danger:hover {
  background-color: #b91c1c;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.table-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.clusters-table {
  width: 100%;
  border-collapse: collapse;
}

.clusters-table th {
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.75rem;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.clusters-table td {
  border-bottom: 1px solid #f3f4f6;
  padding: 1rem 0.75rem;
  vertical-align: middle;
}

.cluster-row {
  transition: background-color 0.2s;
}

.cluster-row:hover {
  background-color: #f9fafb;
}

.cluster-row.selected {
  background-color: #eff6ff;
}

.checkbox-column {
  width: 40px;
}

.cluster-checkbox {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.name-column {
  min-width: 200px;
}

.cluster-name {
  cursor: pointer;
}

.cluster-name:hover .font-semibold {
  color: #2563eb;
}

.status-column {
  width: 100px;
}

.status-badge {
  font-size: 0.625rem;
  line-height: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.connection-column {
  width: 140px;
}

.version-column {
  width: 100px;
}

.nodes-column {
  width: 80px;
}

.pods-column {
  width: 80px;
}

.resources-column {
  width: 200px;
}

.resource-usage {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.usage-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.usage-label {
  font-size: 0.625rem;
  font-weight: 500;
  color: #374151;
  width: 30px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #10b981;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-fill.medium-usage {
  background-color: #f59e0b;
}

.progress-fill.high-usage {
  background-color: #ef4444;
}

.usage-percent {
  font-size: 0.625rem;
  font-weight: 500;
  color: #374151;
  width: 30px;
  text-align: right;
}

.created-column {
  width: 100px;
}

.actions-column {
  width: 120px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.add-cluster-modal {
  max-width: 800px;
  max-height: 85vh;
}

.delete-modal {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #374151;
  background-color: #f3f4f6;
}

.modal-content {
  padding: 2rem;
}

.delete-message {
  margin: 1rem 0;
  color: #374151;
  line-height: 1.6;
}

/* Form Styles */
.add-cluster-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: Monaco, 'Courier New', monospace;
  font-size: 0.75rem;
}

.file-input {
  padding: 0.5rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.375rem;
  background-color: #f9fafb;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}

.file-input:hover {
  border-color: #9ca3af;
  background-color: #f3f4f6;
}

.form-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.connection-tabs {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.tab-button {
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-button:hover {
  color: #374151;
}

.tab-button.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.connection-config {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.detail-grid {
  display: grid;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.detail-item:hover {
  background-color: #f3f4f6;
  border-color: #e5e7eb;
}

@media (max-width: 1024px) {
  .resources-column {
    display: none;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .actions-section {
    justify-content: flex-end;
  }
  
  .connection-column,
  .version-column,
  .nodes-column,
  .pods-column,
  .created-column {
    display: none;
  }
  
  .modal {
    margin: 1rem;
    width: calc(100% - 2rem);
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .connection-tabs {
    flex-wrap: wrap;
  }
}
</style>