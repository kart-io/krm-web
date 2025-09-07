<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { kubernetesApi, type ClusterInfo, type DashboardMetrics } from '../services/kubernetesApi'

const clusterData = ref<ClusterInfo[]>([])
const totalMetrics = ref<DashboardMetrics>({
  clusters: 0,
  nodes: 0,
  pods: 0,
  services: 0,
  deployments: 0
})

const loading = ref(true)
const error = ref<string | null>(null)

const loadDashboardData = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Load dashboard metrics and cluster data in parallel
    const [metrics, clusters] = await Promise.all([
      kubernetesApi.getDashboardMetrics(),
      kubernetesApi.getClusters()
    ])
    
    totalMetrics.value = metrics
    clusterData.value = clusters
  } catch (err) {
    error.value = 'Failed to load dashboard data'
    console.error('Dashboard loading error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<template>
  <div class="dashboard">
    <div class="container">
      <div class="hero">
        <h1>Kubernetes Dashboard</h1>
        <p>Monitor and manage your Kubernetes clusters with ease</p>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-icon">❌</div>
        <p>{{ error }}</p>
        <button @click="loadDashboardData" class="retry-button">Retry</button>
      </div>

      <div v-else class="dashboard-content">
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">{{ totalMetrics.clusters }}</div>
            <div class="metric-label">Clusters</div>
            <div class="metric-icon">🏢</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">{{ totalMetrics.nodes }}</div>
            <div class="metric-label">Nodes</div>
            <div class="metric-icon">💻</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">{{ totalMetrics.pods }}</div>
            <div class="metric-label">Pods</div>
            <div class="metric-icon">📦</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">{{ totalMetrics.services }}</div>
            <div class="metric-label">Services</div>
            <div class="metric-icon">🔗</div>
          </div>

          <div class="metric-card">
            <div class="metric-value">{{ totalMetrics.deployments }}</div>
            <div class="metric-label">Deployments</div>
            <div class="metric-icon">🚀</div>
          </div>
        </div>

        <div class="cluster-section">
          <h2>Cluster Overview</h2>
          <div class="cluster-grid">
            <div 
              v-for="cluster in clusterData" 
              :key="cluster.name"
              class="cluster-card"
              :class="`status-${cluster.status}`"
            >
              <div class="cluster-header">
                <h3>{{ cluster.name }}</h3>
                <div class="status-badge" :class="`badge-${cluster.status}`">
                  {{ cluster.status }}
                </div>
              </div>
              
              <div class="cluster-stats">
                <div class="stat">
                  <span class="stat-label">Nodes:</span>
                  <span class="stat-value">{{ cluster.nodes }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Pods:</span>
                  <span class="stat-value">{{ cluster.pods }}</span>
                </div>
              </div>
              
              <div v-if="cluster.version" class="cluster-version">
                <span class="version-label">Version:</span>
                <span class="version-value">{{ cluster.version }}</span>
              </div>
              
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
                  <span class="usage-label">Memory</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.metric-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.metric-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #326ce5;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.metric-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  opacity: 0.7;
}

.cluster-section h2 {
  font-size: 1.875rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.cluster-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.cluster-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #10b981;
  transition: transform 0.2s, box-shadow 0.2s;
}

.cluster-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.cluster-card.status-warning {
  border-left-color: #f59e0b;
}

.cluster-card.status-error {
  border-left-color: #ef4444;
}

.cluster-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.cluster-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2937;
  text-transform: capitalize;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-healthy {
  background-color: #dcfce7;
  color: #166534;
}

.badge-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.badge-error {
  background-color: #fee2e2;
  color: #991b1b;
}

.cluster-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: bold;
  color: #1f2937;
}

.resource-usage {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.usage-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.usage-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  min-width: 60px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #10b981;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-fill.medium-usage {
  background-color: #f59e0b;
}

.progress-fill.high-usage {
  background-color: #ef4444;
}

.usage-percent {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  min-width: 40px;
  text-align: right;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #326ce5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p,
.error-state p {
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-button {
  background: linear-gradient(135deg, #326ce5 0%, #1e3a8a 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.retry-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(50, 108, 229, 0.4);
}

.cluster-version {
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.version-label {
  color: #6b7280;
  font-weight: 500;
}

.version-value {
  color: #374151;
  font-weight: 600;
  margin-left: 0.25rem;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .cluster-grid {
    grid-template-columns: 1fr;
  }
  
  .cluster-stats {
    flex-direction: column;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
