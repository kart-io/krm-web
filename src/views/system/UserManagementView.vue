<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface User {
  id: string
  username: string
  email: string
  realName: string
  status: 'active' | 'inactive' | 'locked'
  roles: string[]
  createdAt: string
  lastLoginAt: string
  avatar?: string
}

const users = ref<User[]>([])
const loading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showRoleModal = ref(false)
const editingUser = ref<User | null>(null)
const selectedUser = ref<User | null>(null)

// 新用户表单
const newUser = ref({
  username: '',
  email: '',
  realName: '',
  password: '',
  confirmPassword: '',
  roles: [] as string[],
  status: 'active' as const
})

// 可用角色列表
const availableRoles = ref([
  { id: 'admin', name: '系统管理员', description: '拥有所有权限' },
  { id: 'user', name: '普通用户', description: '基础查看权限' },
  { id: 'developer', name: '开发者', description: '开发相关权限' },
  { id: 'operator', name: '运维人员', description: '运维相关权限' }
])

const searchQuery = ref('')
const statusFilter = ref('')

onMounted(() => {
  loadUsers()
})

const loadUsers = () => {
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    users.value = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@kubeasy.com',
        realName: '系统管理员',
        status: 'active',
        roles: ['admin'],
        createdAt: '2025-01-01T00:00:00Z',
        lastLoginAt: '2025-01-15T10:30:00Z'
      },
      {
        id: '2',
        username: 'dukuan',
        email: 'dukuan@kubeasy.com',
        realName: '杜宽',
        status: 'active',
        roles: ['admin', 'developer'],
        createdAt: '2025-01-02T00:00:00Z',
        lastLoginAt: '2025-01-15T09:15:00Z'
      },
      {
        id: '3',
        username: 'developer',
        email: 'dev@kubeasy.com',
        realName: '开发者',
        status: 'active',
        roles: ['developer'],
        createdAt: '2025-01-03T00:00:00Z',
        lastLoginAt: '2025-01-14T16:45:00Z'
      },
      {
        id: '4',
        username: 'operator',
        email: 'ops@kubeasy.com',
        realName: '运维人员',
        status: 'inactive',
        roles: ['operator'],
        createdAt: '2025-01-04T00:00:00Z',
        lastLoginAt: '2025-01-10T08:20:00Z'
      }
    ]
    loading.value = false
  }, 1000)
}

const filteredUsers = computed(() => {
  let filtered = users.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.realName.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(user => user.status === statusFilter.value)
  }
  
  return filtered
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'inactive': return 'bg-gray-100 text-gray-800'
    case 'locked': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return '活跃'
    case 'inactive': return '非活跃'
    case 'locked': return '锁定'
    default: return '未知'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const openCreateModal = () => {
  newUser.value = {
    username: '',
    email: '',
    realName: '',
    password: '',
    confirmPassword: '',
    roles: [],
    status: 'active'
  }
  showCreateModal.value = true
}

const editUser = (user: User) => {
  editingUser.value = { ...user }
  showEditModal.value = true
}

const manageUserRoles = (user: User) => {
  selectedUser.value = user
  showRoleModal.value = true
}

const toggleUserStatus = (user: User) => {
  const newStatus = user.status === 'active' ? 'inactive' : 'active'
  user.status = newStatus
  console.log(`User ${user.username} status changed to ${newStatus}`)
  // 这里应该调用API保存更改
}

const deleteUser = (user: User) => {
  if (confirm(`确认删除用户 ${user.username}？`)) {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
    }
    console.log(`User ${user.username} deleted`)
  }
}

const resetPassword = (user: User) => {
  if (confirm(`确认重置用户 ${user.username} 的密码？`)) {
    console.log(`Password reset for user ${user.username}`)
    // 这里应该调用API重置密码
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showRoleModal.value = false
  editingUser.value = null
  selectedUser.value = null
}

const saveUser = () => {
  // 这里应该调用API保存用户
  console.log('Save user:', newUser.value)
  closeModal()
}

const updateUser = () => {
  // 这里应该调用API更新用户
  if (editingUser.value) {
    const index = users.value.findIndex(u => u.id === editingUser.value!.id)
    if (index > -1) {
      users.value[index] = { ...editingUser.value }
    }
  }
  closeModal()
}
</script>

<template>
  <div class="space-y-6">
    <!-- 头部操作区 -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-xl font-bold text-gray-900">用户管理</h2>
        <p class="text-gray-600 mt-1">管理系统用户账号和权限</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="btn-primary flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        <span>新建用户</span>
      </button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="card p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-2">搜索用户</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="用户名、邮箱或姓名"
            class="input-field"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-2">状态筛选</label>
          <select v-model="statusFilter" class="input-field">
            <option value="">全部状态</option>
            <option value="active">活跃</option>
            <option value="inactive">非活跃</option>
            <option value="locked">锁定</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="loadUsers" class="btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            刷新
          </button>
        </div>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="card overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-kubernetes-600"></div>
        <p class="mt-2 text-gray-600">加载用户数据...</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最后登录</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-4 py-2 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <div class="h-10 w-10 rounded-full bg-kubernetes-100 flex items-center justify-center">
                      <span class="text-xs font-medium text-kubernetes-700">
                        {{ user.realName?.charAt(0) || user.username.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-xs font-medium text-gray-900">{{ user.realName || user.username }}</div>
                    <div class="text-xs text-gray-500">{{ user.email }}</div>
                    <div class="text-xs text-gray-400">@{{ user.username }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusColor(user.status)"
                >
                  {{ getStatusText(user.status) }}
                </span>
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <div class="flex space-x-1">
                  <span 
                    v-for="role in user.roles" 
                    :key="role"
                    class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                  >
                    {{ availableRoles.find(r => r.id === role)?.name || role }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                {{ formatDate(user.lastLoginAt) }}
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-xs font-medium space-x-2">
                <button 
                  @click="editUser(user)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  编辑
                </button>
                <button 
                  @click="manageUserRoles(user)"
                  class="text-green-600 hover:text-green-900"
                >
                  角色
                </button>
                <button 
                  @click="resetPassword(user)"
                  class="text-yellow-600 hover:text-yellow-900"
                >
                  重置密码
                </button>
                <button 
                  @click="toggleUserStatus(user)"
                  class="hover:text-gray-900"
                  :class="user.status === 'active' ? 'text-yellow-600' : 'text-green-600'"
                >
                  {{ user.status === 'active' ? '禁用' : '启用' }}
                </button>
                <button 
                  @click="deleteUser(user)"
                  class="text-red-600 hover:text-red-900"
                  v-if="user.username !== 'admin'"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 创建用户模态框 -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <h3 class="text-xs font-semibold text-gray-900 mb-4">创建新用户</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">用户名</label>
            <input
              v-model="newUser.username"
              type="text"
              placeholder="用户名"
              class="input-field"
            />
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">邮箱</label>
            <input
              v-model="newUser.email"
              type="email"
              placeholder="用户邮箱"
              class="input-field"
            />
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">真实姓名</label>
            <input
              v-model="newUser.realName"
              type="text"
              placeholder="真实姓名"
              class="input-field"
            />
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">密码</label>
            <input
              v-model="newUser.password"
              type="password"
              placeholder="用户密码"
              class="input-field"
            />
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">确认密码</label>
            <input
              v-model="newUser.confirmPassword"
              type="password"
              placeholder="确认密码"
              class="input-field"
            />
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">状态</label>
            <select v-model="newUser.status" class="input-field">
              <option value="active">活跃</option>
              <option value="inactive">非活跃</option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button @click="closeModal" class="btn-secondary">取消</button>
          <button @click="saveUser" class="btn-primary">创建</button>
        </div>
      </div>
    </div>

    <!-- 编辑用户模态框 -->
    <div v-if="showEditModal && editingUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <h3 class="text-xs font-semibold text-gray-900 mb-4">编辑用户</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">用户名</label>
            <input
              v-model="editingUser.username"
              type="text"
              class="input-field"
              disabled
            />
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">邮箱</label>
            <input
              v-model="editingUser.email"
              type="email"
              class="input-field"
            />
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">真实姓名</label>
            <input
              v-model="editingUser.realName"
              type="text"
              class="input-field"
            />
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button @click="closeModal" class="btn-secondary">取消</button>
          <button @click="updateUser" class="btn-primary">保存</button>
        </div>
      </div>
    </div>

    <!-- 角色管理模态框 -->
    <div v-if="showRoleModal && selectedUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-xs font-semibold text-gray-900 mb-4">管理用户角色</h3>
        <p class="text-xs text-gray-600 mb-4">用户: {{ selectedUser.realName || selectedUser.username }}</p>
        
        <div class="space-y-3">
          <div 
            v-for="role in availableRoles" 
            :key="role.id"
            class="flex items-center justify-between p-3 border rounded-lg"
          >
            <div>
              <div class="font-medium">{{ role.name }}</div>
              <div class="text-xs text-gray-500">{{ role.description }}</div>
            </div>
            <input
              type="checkbox"
              :checked="selectedUser.roles.includes(role.id)"
              @change="(e) => {
                const target = e.target as HTMLInputElement
                if (selectedUser && target.checked) {
                  if (!selectedUser.roles.includes(role.id)) {
                    selectedUser.roles.push(role.id)
                  }
                } else if (selectedUser) {
                  const index = selectedUser.roles.indexOf(role.id)
                  if (index > -1) {
                    selectedUser.roles.splice(index, 1)
                  }
                }
              }"
            />
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button @click="closeModal" class="btn-secondary">取消</button>
          <button @click="closeModal" class="btn-primary">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>