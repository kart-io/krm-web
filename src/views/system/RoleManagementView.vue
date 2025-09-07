<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Permission {
  id: string
  name: string
  resource: string
  action: string
  description: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  createdAt: string
  updatedAt: string
  isSystem: boolean
}

const roles = ref<Role[]>([])
const permissions = ref<Permission[]>([])
const loading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showPermissionModal = ref(false)
const editingRole = ref<Role | null>(null)
const selectedRole = ref<Role | null>(null)

// 新角色表单
const newRole = ref({
  name: '',
  description: '',
  permissions: [] as string[]
})

const searchQuery = ref('')

// 权限分类
const permissionCategories = ref({
  'cluster': '集群管理',
  'node': '节点管理',
  'namespace': '命名空间',
  'deployment': '部署管理',
  'pod': 'Pod管理',
  'service': '服务管理',
  'user': '用户管理',
  'role': '角色管理',
  'menu': '菜单管理',
  'system': '系统管理'
})

onMounted(() => {
  loadRoles()
  loadPermissions()
})

const loadRoles = () => {
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    roles.value = [
      {
        id: 'admin',
        name: '系统管理员',
        description: '拥有系统所有权限',
        permissions: ['*'],
        userCount: 2,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        isSystem: true
      },
      {
        id: 'developer',
        name: '开发者',
        description: '开发相关权限',
        permissions: [
          'cluster:read', 'node:read', 'namespace:read', 'namespace:create',
          'deployment:read', 'deployment:create', 'deployment:update',
          'pod:read', 'pod:create', 'pod:delete', 'service:read', 'service:create'
        ],
        userCount: 5,
        createdAt: '2025-01-02T00:00:00Z',
        updatedAt: '2025-01-10T00:00:00Z',
        isSystem: false
      },
      {
        id: 'operator',
        name: '运维人员',
        description: '运维相关权限',
        permissions: [
          'cluster:read', 'node:read', 'node:update',
          'namespace:read', 'deployment:read', 'deployment:update',
          'pod:read', 'pod:delete', 'service:read'
        ],
        userCount: 3,
        createdAt: '2025-01-03T00:00:00Z',
        updatedAt: '2025-01-12T00:00:00Z',
        isSystem: false
      },
      {
        id: 'user',
        name: '普通用户',
        description: '基础查看权限',
        permissions: [
          'cluster:read', 'node:read', 'namespace:read',
          'deployment:read', 'pod:read', 'service:read'
        ],
        userCount: 10,
        createdAt: '2025-01-04T00:00:00Z',
        updatedAt: '2025-01-08T00:00:00Z',
        isSystem: false
      }
    ]
    loading.value = false
  }, 800)
}

const loadPermissions = () => {
  // 模拟权限数据
  permissions.value = [
    // 集群权限
    { id: 'cluster:read', name: '查看集群', resource: 'cluster', action: 'read', description: '查看集群信息和状态' },
    { id: 'cluster:create', name: '创建集群', resource: 'cluster', action: 'create', description: '创建新的集群' },
    { id: 'cluster:update', name: '更新集群', resource: 'cluster', action: 'update', description: '修改集群配置' },
    { id: 'cluster:delete', name: '删除集群', resource: 'cluster', action: 'delete', description: '删除集群' },
    
    // 节点权限
    { id: 'node:read', name: '查看节点', resource: 'node', action: 'read', description: '查看节点信息' },
    { id: 'node:update', name: '管理节点', resource: 'node', action: 'update', description: '管理节点状态' },
    
    // 命名空间权限
    { id: 'namespace:read', name: '查看命名空间', resource: 'namespace', action: 'read', description: '查看命名空间' },
    { id: 'namespace:create', name: '创建命名空间', resource: 'namespace', action: 'create', description: '创建新命名空间' },
    { id: 'namespace:delete', name: '删除命名空间', resource: 'namespace', action: 'delete', description: '删除命名空间' },
    
    // 部署权限
    { id: 'deployment:read', name: '查看部署', resource: 'deployment', action: 'read', description: '查看部署信息' },
    { id: 'deployment:create', name: '创建部署', resource: 'deployment', action: 'create', description: '创建新部署' },
    { id: 'deployment:update', name: '更新部署', resource: 'deployment', action: 'update', description: '更新部署配置' },
    { id: 'deployment:delete', name: '删除部署', resource: 'deployment', action: 'delete', description: '删除部署' },
    
    // Pod权限
    { id: 'pod:read', name: '查看Pod', resource: 'pod', action: 'read', description: '查看Pod信息' },
    { id: 'pod:create', name: '创建Pod', resource: 'pod', action: 'create', description: '创建新Pod' },
    { id: 'pod:delete', name: '删除Pod', resource: 'pod', action: 'delete', description: '删除Pod' },
    
    // 服务权限
    { id: 'service:read', name: '查看服务', resource: 'service', action: 'read', description: '查看服务信息' },
    { id: 'service:create', name: '创建服务', resource: 'service', action: 'create', description: '创建新服务' },
    { id: 'service:update', name: '更新服务', resource: 'service', action: 'update', description: '更新服务配置' },
    { id: 'service:delete', name: '删除服务', resource: 'service', action: 'delete', description: '删除服务' },
    
    // 用户管理权限
    { id: 'user:read', name: '查看用户', resource: 'user', action: 'read', description: '查看用户信息' },
    { id: 'user:create', name: '创建用户', resource: 'user', action: 'create', description: '创建新用户' },
    { id: 'user:update', name: '更新用户', resource: 'user', action: 'update', description: '更新用户信息' },
    { id: 'user:delete', name: '删除用户', resource: 'user', action: 'delete', description: '删除用户' },
    { id: 'user:manage', name: '用户管理', resource: 'user', action: 'manage', description: '完整的用户管理权限' },
    
    // 角色管理权限
    { id: 'role:read', name: '查看角色', resource: 'role', action: 'read', description: '查看角色信息' },
    { id: 'role:create', name: '创建角色', resource: 'role', action: 'create', description: '创建新角色' },
    { id: 'role:update', name: '更新角色', resource: 'role', action: 'update', description: '更新角色配置' },
    { id: 'role:delete', name: '删除角色', resource: 'role', action: 'delete', description: '删除角色' },
    { id: 'role:manage', name: '角色管理', resource: 'role', action: 'manage', description: '完整的角色管理权限' },
    
    // 菜单管理权限
    { id: 'menu:read', name: '查看菜单', resource: 'menu', action: 'read', description: '查看菜单配置' },
    { id: 'menu:manage', name: '菜单管理', resource: 'menu', action: 'manage', description: '完整的菜单管理权限' },
    
    // 系统管理权限
    { id: 'system:read', name: '系统查看', resource: 'system', action: 'read', description: '查看系统信息' },
    { id: 'system:manage', name: '系统管理', resource: 'system', action: 'manage', description: '完整的系统管理权限' }
  ]
}

const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value
  const query = searchQuery.value.toLowerCase()
  return roles.value.filter(role => 
    role.name.toLowerCase().includes(query) ||
    role.description.toLowerCase().includes(query)
  )
})

const getPermissionsByCategory = computed(() => {
  const result: Record<string, Permission[]> = {}
  
  for (const [category, categoryName] of Object.entries(permissionCategories.value)) {
    result[category] = permissions.value.filter(p => p.resource === category)
  }
  
  return result
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const openCreateModal = () => {
  newRole.value = {
    name: '',
    description: '',
    permissions: []
  }
  showCreateModal.value = true
}

const editRole = (role: Role) => {
  editingRole.value = { ...role }
  showEditModal.value = true
}

const managePermissions = (role: Role) => {
  selectedRole.value = { ...role }
  showPermissionModal.value = true
}

const deleteRole = (role: Role) => {
  if (role.isSystem) {
    alert('系统角色不能删除')
    return
  }
  
  if (confirm(`确认删除角色 ${role.name}？`)) {
    const index = roles.value.findIndex(r => r.id === role.id)
    if (index > -1) {
      roles.value.splice(index, 1)
    }
    console.log(`Role ${role.name} deleted`)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showPermissionModal.value = false
  editingRole.value = null
  selectedRole.value = null
}

const saveRole = () => {
  // 这里应该调用API保存角色
  const newRoleData: Role = {
    id: Date.now().toString(),
    name: newRole.value.name,
    description: newRole.value.description,
    permissions: newRole.value.permissions,
    userCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isSystem: false
  }
  
  roles.value.push(newRoleData)
  closeModal()
}

const updateRole = () => {
  if (editingRole.value) {
    const index = roles.value.findIndex(r => r.id === editingRole.value!.id)
    if (index > -1) {
      roles.value[index] = { 
        ...editingRole.value, 
        updatedAt: new Date().toISOString() 
      }
    }
  }
  closeModal()
}

const savePermissions = () => {
  if (selectedRole.value) {
    const index = roles.value.findIndex(r => r.id === selectedRole.value!.id)
    if (index > -1) {
      roles.value[index].permissions = selectedRole.value.permissions
      roles.value[index].updatedAt = new Date().toISOString()
    }
  }
  closeModal()
}

const togglePermission = (permissionId: string) => {
  if (!selectedRole.value) return
  
  const index = selectedRole.value.permissions.indexOf(permissionId)
  if (index > -1) {
    selectedRole.value.permissions.splice(index, 1)
  } else {
    selectedRole.value.permissions.push(permissionId)
  }
}

const isPermissionSelected = (permissionId: string): boolean => {
  if (!selectedRole.value) return false
  return selectedRole.value.permissions.includes(permissionId) || 
         selectedRole.value.permissions.includes('*')
}
</script>

<template>
  <div class="space-y-6">
    <!-- 头部操作区 -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-xl font-bold text-gray-900">角色管理</h2>
        <p class="text-gray-600 mt-1">管理用户角色和权限分配</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="btn-primary flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        <span>新建角色</span>
      </button>
    </div>

    <!-- 搜索 -->
    <div class="card p-4">
      <div class="max-w-md">
        <label class="block text-sm font-medium text-gray-700 mb-2">搜索角色</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="角色名称或描述"
          class="input-field"
        />
      </div>
    </div>

    <!-- 角色列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="role in filteredRoles" 
        :key="role.id"
        class="card p-6 hover:shadow-lg transition-all duration-200"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-kubernetes-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">🎭</span>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-900">{{ role.name }}</h3>
              <p class="text-sm text-gray-500">{{ role.userCount }} 个用户</p>
            </div>
          </div>
          <span 
            v-if="role.isSystem"
            class="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full"
          >
            系统角色
          </span>
        </div>

        <p class="text-gray-600 text-sm mb-4">{{ role.description }}</p>

        <div class="mb-4">
          <div class="text-xs text-gray-500 mb-2">权限数量</div>
          <div class="text-sm font-semibold text-kubernetes-600">
            {{ role.permissions.includes('*') ? '所有权限' : role.permissions.length + ' 个权限' }}
          </div>
        </div>

        <div class="text-xs text-gray-500 mb-4">
          <div>创建时间: {{ formatDate(role.createdAt) }}</div>
          <div>更新时间: {{ formatDate(role.updatedAt) }}</div>
        </div>

        <div class="flex space-x-2">
          <button 
            @click="editRole(role)"
            class="flex-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded transition-colors"
            :disabled="role.isSystem"
          >
            编辑
          </button>
          <button 
            @click="managePermissions(role)"
            class="flex-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 py-2 px-3 rounded transition-colors"
            :disabled="role.isSystem"
          >
            权限
          </button>
          <button 
            @click="deleteRole(role)"
            class="flex-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded transition-colors"
            :disabled="role.isSystem"
            v-if="!role.isSystem"
          >
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- 创建角色模态框 -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">创建新角色</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">角色名称</label>
            <input
              v-model="newRole.name"
              type="text"
              placeholder="角色名称"
              class="input-field"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">角色描述</label>
            <textarea
              v-model="newRole.description"
              placeholder="角色描述"
              class="input-field"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button @click="closeModal" class="btn-secondary">取消</button>
          <button @click="saveRole" class="btn-primary">创建</button>
        </div>
      </div>
    </div>

    <!-- 编辑角色模态框 -->
    <div v-if="showEditModal && editingRole" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">编辑角色</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">角色名称</label>
            <input
              v-model="editingRole.name"
              type="text"
              class="input-field"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">角色描述</label>
            <textarea
              v-model="editingRole.description"
              class="input-field"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button @click="closeModal" class="btn-secondary">取消</button>
          <button @click="updateRole" class="btn-primary">保存</button>
        </div>
      </div>
    </div>

    <!-- 权限管理模态框 -->
    <div v-if="showPermissionModal && selectedRole" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-4xl max-w-4xl max-h-[80vh] overflow-y-auto">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">管理角色权限</h3>
        <p class="text-sm text-gray-600 mb-6">角色: {{ selectedRole.name }}</p>
        
        <div class="space-y-6">
          <div 
            v-for="(categoryPermissions, category) in getPermissionsByCategory" 
            :key="category"
            v-if="categoryPermissions && categoryPermissions.length > 0"
          >
            <h4 class="font-medium text-gray-900 mb-3">
              {{ (permissionCategories as Record<string, string>)[category as string] }}
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div 
                v-for="permission in categoryPermissions" 
                :key="permission.id"
                class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div class="flex-1">
                  <div class="font-medium text-sm">{{ permission.name }}</div>
                  <div class="text-xs text-gray-500">{{ permission.description }}</div>
                  <div class="text-xs text-blue-600 mt-1">{{ permission.id }}</div>
                </div>
                <input
                  type="checkbox"
                  :checked="isPermissionSelected(permission.id)"
                  @change="togglePermission(permission.id)"
                  :disabled="selectedRole.permissions.includes('*')"
                  class="ml-3"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6 pt-6 border-t">
          <button @click="closeModal" class="btn-secondary">取消</button>
          <button @click="savePermissions" class="btn-primary">保存权限</button>
        </div>
      </div>
    </div>
  </div>
</template>