<template>
  <div class="oauth-config-view">
    <div class="container">
      <!-- Header -->
      <div class="header-section">
        <div class="page-header">
          <h1 class="app-page-title">OAuth Configuration</h1>
          <p class="app-page-subtitle">Manage third-party authentication providers</p>
        </div>
        
        <div class="header-actions">
          <button 
            @click="saveConfig" 
            :disabled="saving"
            class="btn btn-primary"
          >
            <span v-if="saving">Saving...</span>
            <span v-else>Save Configuration</span>
          </button>
        </div>
      </div>

      <!-- OAuth Global Settings -->
      <div class="config-card">
        <div class="card-header">
          <h3 class="card-title">Global OAuth Settings</h3>
          <p class="card-description">Configure general OAuth behavior</p>
        </div>
        
        <div class="card-content">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                <input 
                  v-model="config.enabled" 
                  type="checkbox"
                  class="form-checkbox"
                />
                Enable OAuth Login
              </label>
              <p class="form-help">Allow users to login using third-party providers</p>
            </div>
          </div>

          <div v-if="config.enabled" class="form-row">
            <div class="form-group">
              <label class="form-label">
                <input 
                  v-model="config.showDivider" 
                  type="checkbox"
                  class="form-checkbox"
                />
                Show Divider
              </label>
              <p class="form-help">Display a separator between regular login and OAuth buttons</p>
            </div>

            <div class="form-group">
              <label class="form-label">Divider Text</label>
              <input 
                v-model="config.dividerText"
                type="text"
                class="form-input"
                placeholder="Or continue with"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- OAuth Providers List -->
      <div v-if="config.enabled" class="config-card">
        <div class="card-header">
          <h3 class="card-title">OAuth Providers</h3>
          <p class="card-description">Manage third-party authentication providers</p>
        </div>
        
        <div class="card-content">
          <!-- Providers Table -->
          <div class="providers-table">
            <table class="table">
              <thead>
                <tr>
                  <th class="table-header">Provider</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">Client ID</th>
                  <th class="table-header">Button Text</th>
                  <th class="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="provider in config.providers" 
                  :key="provider.id"
                  class="table-row"
                  :class="{ 'row-configured': provider.clientId }"
                >
                  <td class="table-cell">
                    <div class="provider-info">
                      <div class="provider-icon">
                        <IconRenderer 
                          :icon="provider.icon" 
                          size="lg"
                          class="oauth-provider-icon"
                        />
                      </div>
                      <div class="provider-details">
                        <div class="provider-name">{{ provider.name }}</div>
                        <div class="provider-id">{{ provider.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="table-cell">
                    <span 
                      class="status-badge"
                      :class="provider.clientId ? 'status-configured' : 'status-not-configured'"
                    >
                      {{ provider.clientId ? 'Configured' : 'Not Configured' }}
                    </span>
                  </td>
                  <td class="table-cell">
                    <span class="client-id">
                      {{ provider.clientId || '未配置' }}
                    </span>
                  </td>
                  <td class="table-cell">
                    <span class="button-text">
                      {{ provider.buttonText || provider.name }}
                    </span>
                  </td>
                  <td class="table-cell">
                    <div class="action-buttons">
                      <button 
                        @click="editProvider(provider)"
                        class="btn-action btn-edit"
                        title="编辑配置"
                      >
                        ⚙️
                      </button>
                      <button 
                        v-if="provider.clientId"
                        @click="testProvider(provider)"
                        :disabled="testing === provider.id"
                        class="btn-action btn-test"
                        title="测试配置"
                      >
                        🔧
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Provider Configuration Modal/Details -->
      <div v-if="config.enabled && editingProvider" class="config-card">
        <div class="card-header">
          <h3 class="card-title">Configure {{ editingProvider.name }}</h3>
          <p class="card-description">Setup OAuth configuration for {{ editingProvider.name }}</p>
        </div>
        
        <div class="card-content">
          <div class="config-form">
            <div class="config-grid">
              <div class="form-group">
                <label class="form-label">Client ID</label>
                <input 
                  v-model="editingProvider.clientId"
                  type="text"
                  class="form-input"
                  :placeholder="`${editingProvider.name} Client ID`"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Button Text</label>
                <input 
                  v-model="editingProvider.buttonText"
                  type="text"
                  class="form-input"
                  :placeholder="`Continue with ${editingProvider.name}`"
                />
              </div>

              <div class="form-group span-2">
                <label class="form-label">Redirect URI</label>
                <input 
                  v-model="editingProvider.redirectUri"
                  type="url"
                  class="form-input"
                  :placeholder="`${globalThis.location.origin}/auth/callback/${editingProvider.id}`"
                />
              </div>

              <div class="form-group span-2">
                <label class="form-label">Authorize URL</label>
                <input 
                  v-model="editingProvider.authorizeUrl"
                  type="url"
                  class="form-input"
                  placeholder="OAuth authorization endpoint URL"
                />
              </div>

              <div class="form-group span-2">
                <label class="form-label">Scope</label>
                <input 
                  v-model="editingProvider.scope"
                  type="text"
                  class="form-input"
                  placeholder="openid profile email"
                />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="form-actions">
              <button 
                @click="closeEditor"
                class="btn btn-outline"
              >
                取消
              </button>
              <button 
                @click="saveProviderConfig"
                class="btn btn-primary"
              >
                保存配置
              </button>
              <button 
                @click="testProvider(editingProvider)"
                :disabled="testing === editingProvider.id"
                class="btn btn-outline"
              >
                <span v-if="testing === editingProvider.id">Testing...</span>
                <span v-else>测试配置</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div v-if="config.enabled" class="config-card">
        <div class="card-header">
          <h3 class="card-title">Preview</h3>
          <p class="card-description">See how OAuth buttons will appear to users</p>
        </div>
        
        <div class="card-content">
          <div class="preview-container">
            <OAuthButtons 
              :config="config"
              :mockMode="true"
              :disabled="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import OAuthButtons from '../../components/OAuthButtons.vue'
import IconRenderer from '../../components/IconRenderer.vue'
import oauthService from '../../services/oauthConfig'
import type { OAuthConfig, OAuthProvider } from '../../types/oauth'

// Reactive data
const config = reactive<OAuthConfig>({
  enabled: true,
  showDivider: true,
  dividerText: 'Or continue with',
  providers: []
})

const saving = ref(false)
const testing = ref<string | null>(null)
const editingProvider = ref<OAuthProvider | null>(null)

// Methods
const loadConfig = async () => {
  try {
    const oauthConfig = await oauthService.getConfig()
    Object.assign(config, oauthConfig)
  } catch (error) {
    console.error('Failed to load OAuth config:', error)
  }
}

const saveConfig = async () => {
  saving.value = true
  
  try {
    // 使用OAuth服务更新配置，会调用kubernetesApi
    await oauthService.updateConfig(config)
    
    // 显示成功消息
    console.log('OAuth configuration saved successfully')
  } catch (error) {
    console.error('Failed to save OAuth config:', error)
  } finally {
    saving.value = false
  }
}

const editProvider = (provider: OAuthProvider) => {
  editingProvider.value = { ...provider }
}

// 移除toggle功能，基于配置状态显示

const closeEditor = () => {
  editingProvider.value = null
}

const saveProviderConfig = () => {
  if (!editingProvider.value) return
  
  const index = config.providers.findIndex(p => p.id === editingProvider.value!.id)
  if (index !== -1) {
    Object.assign(config.providers[index], editingProvider.value)
  }
  closeEditor()
}

const testProvider = async (provider: OAuthProvider) => {
  testing.value = provider.id
  
  try {
    // 在真实应用中，这里会测试OAuth配置
    // await api.post(`/admin/oauth/test/${provider.id}`)
    
    // Mock测试操作
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log(`OAuth test successful for ${provider.name}`)
  } catch (error) {
    console.error(`OAuth test failed for ${provider.name}:`, error)
  } finally {
    testing.value = null
  }
}

// Lifecycle
onMounted(() => {
  loadConfig()
})
</script>

<style scoped>
.oauth-config-view {
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  space-y: 2rem;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin-bottom: 0.5rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Config Cards */
.config-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.card-header {
  padding: 1.5rem 1.5rem 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.card-description {
  color: #6b7280;
  font-size: 0.875rem;
}

.card-content {
  padding: 0 1.5rem 1.5rem;
}

/* Table Styles */
.providers-table {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-header {
  background: #f8fafc;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.table-row {
  transition: all 0.2s;
}

.table-row:hover {
  background: #f8fafc;
}

.table-row.row-configured {
  background: rgba(34, 197, 94, 0.05);
}

.table-cell {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
}

.provider-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.provider-icon {
  font-size: 1.5rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.8);
}

.provider-details {
  flex: 1;
}

.provider-name {
  font-weight: 600;
  color: #111827;
  margin: 0;
  font-size: 0.875rem;
}

.provider-id {
  color: #6b7280;
  margin: 2px 0 0 0;
  font-size: 0.75rem;
  font-family: monospace;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-configured {
  background: #dcfce7;
  color: #166534;
}

.status-not-configured {
  background: #fef3f2;
  color: #991b1b;
}

.client-id {
  font-family: monospace;
  font-size: 0.75rem;
  color: #4b5563;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.button-text {
  font-size: 0.875rem;
  color: #374151;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn-action:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.btn-edit:hover {
  background: #dbeafe;
  border-color: #3b82f6;
}

.btn-enable:hover {
  background: #dcfce7;
  border-color: #22c55e;
}

.btn-disable:hover {
  background: #fef3f2;
  border-color: #ef4444;
}

.btn-test:hover {
  background: #fef3c7;
  border-color: #f59e0b;
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Form Styles */
.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  flex: 1;
}

.config-form {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-checkbox {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  accent-color: #3b82f6;
}

.form-help {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* Providers Grid */
.providers-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
}

.provider-card {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  background: #f9fafb;
  transition: all 0.3s;
}

.provider-card.provider-enabled {
  border-color: #3b82f6;
  background: #eff6ff;
}

.provider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.provider-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.provider-icon {
  font-size: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.8);
}

.provider-name {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.provider-id {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  font-family: monospace;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 3rem;
  height: 1.5rem;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 1.5rem;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 1.125rem;
  width: 1.125rem;
  left: 0.1875rem;
  bottom: 0.1875rem;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle-input:checked + .toggle-slider {
  background-color: #3b82f6;
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(1.5rem);
}

/* Provider Config */
.provider-config {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.config-grid .span-2 {
  grid-column: span 2;
}

.provider-actions {
  display: flex;
  justify-content: flex-end;
}

/* Preview */
.preview-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: #f1f5f9;
  border-radius: 8px;
  border: 2px dashed #cbd5e1;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  color: #3b82f6;
  border-color: #3b82f6;
}

.btn-outline:hover {
  background: #3b82f6;
  color: white;
}

.btn-outline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .oauth-config-view {
    padding: 1rem;
  }
  
  .header-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .providers-grid {
    grid-template-columns: 1fr;
  }
  
  .config-grid {
    grid-template-columns: 1fr;
  }
  
  .config-grid .span-2 {
    grid-column: span 1;
  }
}
</style>