<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { menuService } from '../../services/menuService'
import type { MenuGroup, MenuItem } from '../../services/kubernetesApi'
import SimpleIconPicker from '../../components/SimpleIconPicker.vue'
import { Settings, Folder, Users } from 'lucide-vue-next'
import IconRenderer from '../../components/IconRenderer.vue'
import FormModal from '../../components/modal/FormModal.vue'
import FormField from '../../components/form/FormField.vue'
import ConfirmDialog from '../../components/modal/ConfirmDialog.vue'

interface TableMenuItem {
  id: string
  title: string
  path: string
  icon: string
  parentId: string
  parentTitle: string
  level: number
  order: number
  enabled: boolean
  description: string
  permissions: string[]
  type: 'group' | 'item'
  groupId: string
}

const menus = ref<MenuGroup[]>([])
const loading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingMenu = ref<MenuItem | null>(null)
const editingGroup = ref<MenuGroup | null>(null)

// 确认删除对话框
const showDeleteDialog = ref(false)
const deleteTarget = ref<{ type: 'group' | 'item', group: MenuGroup, item?: MenuItem } | null>(null)
const submitting = ref(false)

// 新菜单表单
const newMenuItem = ref({
  id: '',
  title: '',
  path: '',
  icon: '',
  parentId: '',
  order: 1,
  enabled: true,
  description: '',
  permissions: [] as string[]
})

// 新分组表单
const newGroup = ref({
  id: '',
  title: '',
  icon: '',
  order: 1,
  enabled: true
})

const permissionInput = ref('')

onMounted(async () => {
  await loadMenus()
})

const loadMenus = async () => {
  loading.value = true
  try {
    // 确保菜单服务已经加载数据
    await menuService.refreshMenus()
    menus.value = menuService.allMenus.value
    console.log('Loaded menus:', menus.value)
  } catch (error) {
    console.error('Failed to load menus:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = (type: 'group' | 'item', parentId?: string) => {
  if (type === 'group') {
    newGroup.value = {
      id: '',
      title: '',
      icon: '',
      order: menus.value.length + 1,
      enabled: true
    }
  } else {
    newMenuItem.value = {
      id: '',
      title: '',
      path: '',
      icon: '',
      parentId: parentId || '',
      order: 1,
      enabled: true,
      description: '',
      permissions: []
    }
  }
  showCreateModal.value = true
}

const addPermission = () => {
  if (permissionInput.value.trim() && !newMenuItem.value.permissions.includes(permissionInput.value.trim())) {
    newMenuItem.value.permissions.push(permissionInput.value.trim())
    permissionInput.value = ''
  }
}

const removePermission = (permission: string) => {
  const index = newMenuItem.value.permissions.indexOf(permission)
  if (index > -1) {
    newMenuItem.value.permissions.splice(index, 1)
  }
}

const toggleMenuStatus = (group: MenuGroup, item?: MenuItem) => {
  if (item) {
    item.enabled = !item.enabled
  } else {
    group.enabled = !group.enabled
  }
  // 这里应该调用API保存更改
  console.log('Toggle status:', { group: group.id, item: item?.id })
}

const editMenu = (group: MenuGroup, item?: MenuItem) => {
  if (item) {
    editingMenu.value = { ...item }
  } else {
    editingGroup.value = { ...group }
  }
  showEditModal.value = true
}

const deleteMenu = (group: MenuGroup, item?: MenuItem) => {
  deleteTarget.value = { type: item ? 'item' : 'group', group, item }
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  if (!deleteTarget.value) return
  
  submitting.value = true
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const { type, group, item } = deleteTarget.value
    if (type === 'item' && item) {
      const index = group.children.findIndex(child => child.id === item.id)
      if (index > -1) {
        group.children.splice(index, 1)
      }
    } else {
      const index = menus.value.findIndex(g => g.id === group.id)
      if (index > -1) {
        menus.value.splice(index, 1)
      }
    }
    
    showDeleteDialog.value = false
    deleteTarget.value = null
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingMenu.value = null
  editingGroup.value = null
}

const cancelDelete = () => {
  showDeleteDialog.value = false
  deleteTarget.value = null
}

// 将嵌套菜单结构转换为表格数据
const tableData = computed<TableMenuItem[]>(() => {
  const result: TableMenuItem[] = []
  
  menus.value.forEach(group => {
    // 添加分组
    result.push({
      id: group.id,
      title: group.title,
      path: '',
      icon: group.icon,
      parentId: '',
      parentTitle: '',
      level: 0,
      order: group.order,
      enabled: group.enabled,
      description: '',
      permissions: [],
      type: 'group',
      groupId: group.id
    })
    
    // 添加分组下的子项
    group.children.forEach(item => {
      result.push({
        id: item.id,
        title: item.title,
        path: item.path || '',
        icon: item.icon,
        parentId: item.parentId || '',
        parentTitle: group.title,
        level: 1,
        order: item.order,
        enabled: item.enabled,
        description: item.description || '',
        permissions: item.permissions || [],
        type: 'item',
        groupId: group.id
      })
    })
  })
  
  return result
})

const viewItem = (row: TableMenuItem) => {
  console.log('查看菜单:', row)
}

const editItem = (row: TableMenuItem) => {
  if (row.type === 'group') {
    const group = menus.value.find(g => g.id === row.id)
    if (group) editMenu(group)
  } else {
    const group = menus.value.find(g => g.id === row.groupId)
    const item = group?.children.find(i => i.id === row.id)
    if (group && item) editMenu(group, item)
  }
}

const deleteItem = (row: TableMenuItem) => {
  if (row.type === 'group') {
    const group = menus.value.find(g => g.id === row.id)
    if (group) deleteMenu(group)
  } else {
    const group = menus.value.find(g => g.id === row.groupId)
    const item = group?.children.find(i => i.id === row.id)
    if (group && item) deleteMenu(group, item)
  }
}

const toggleStatus = (row: TableMenuItem) => {
  if (row.type === 'group') {
    const group = menus.value.find(g => g.id === row.id)
    if (group) toggleMenuStatus(group)
  } else {
    const group = menus.value.find(g => g.id === row.groupId)
    const item = group?.children.find(i => i.id === row.id)
    if (group && item) toggleMenuStatus(group, item)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 头部操作区 -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-xl font-bold text-gray-900">菜单管理</h2>
        <p class="text-gray-600 mt-1">管理系统菜单结构和权限</p>
      </div>
      <button 
        @click="openCreateModal('group')" 
        class="btn-primary flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        <span>新建分组</span>
      </button>
    </div>

    <!-- 菜单表格 -->
    <div class="card overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-kubernetes-600"></div>
        <p class="mt-2 text-gray-600">加载菜单数据...</p>
      </div>

      <div v-else>
        <vxe-table 
          :data="tableData" 
          border 
          stripe 
          size="small"
          show-overflow="title"
          :tree-config="{ children: 'children', indent: 20, line: true }"
        >
          <vxe-column type="checkbox" width="50"></vxe-column>
          <vxe-column type="seq" title="序号" width="60"></vxe-column>
          
          <vxe-column field="title" title="菜单名称" width="200" tree-node>
            <template #default="{ row }">
              <div class="flex items-center space-x-2">
                <IconRenderer :icon="row.icon" size="md" />
                <span :class="row.type === 'group' ? 'font-semibold' : ''">{{ row.title }}</span>
                <span 
                  v-if="row.type === 'group'"
                  class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                >
                  分组
                </span>
              </div>
            </template>
          </vxe-column>
          
          <vxe-column field="path" title="路径" width="180">
            <template #default="{ row }">
              <code v-if="row.path" class="text-xs bg-gray-100 px-2 py-1 rounded">{{ row.path }}</code>
              <span v-else class="text-gray-400">-</span>
            </template>
          </vxe-column>
          
          <vxe-column field="description" title="描述" width="200">
            <template #default="{ row }">
              <span v-if="row.description">{{ row.description }}</span>
              <span v-else class="text-gray-400">-</span>
            </template>
          </vxe-column>
          
          <vxe-column field="permissions" title="权限" width="250">
            <template #default="{ row }">
              <div v-if="row.permissions.length > 0" class="flex flex-wrap gap-1">
                <span 
                  v-for="permission in row.permissions" 
                  :key="permission"
                  class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded"
                >
                  {{ permission }}
                </span>
              </div>
              <span v-else class="text-gray-400">无权限要求</span>
            </template>
          </vxe-column>
          
          <vxe-column field="order" title="排序" width="80" align="center">
            <template #default="{ row }">
              <span class="text-sm">{{ row.order }}</span>
            </template>
          </vxe-column>
          
          <vxe-column field="enabled" title="状态" width="80" align="center">
            <template #default="{ row }">
              <span 
                class="px-2 py-1 text-xs font-semibold rounded-full"
                :class="row.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ row.enabled ? '启用' : '禁用' }}
              </span>
            </template>
          </vxe-column>
          
          <vxe-column title="操作" width="280" fixed="right">
            <template #default="{ row }">
              <div class="flex items-center space-x-1">
                <button 
                  v-if="row.type === 'group'"
                  @click="openCreateModal('item', row.id)" 
                  class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  添加子项
                </button>
                <button 
                  @click="viewItem(row)" 
                  class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  查看
                </button>
                <button 
                  @click="editItem(row)" 
                  class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  编辑
                </button>
                <button 
                  @click="toggleStatus(row)" 
                  class="px-2 py-1 text-xs rounded hover:opacity-80"
                  :class="row.enabled ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'"
                >
                  {{ row.enabled ? '禁用' : '启用' }}
                </button>
                <button 
                  @click="deleteItem(row)" 
                  class="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  删除
                </button>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>

    <!-- 创建/编辑模态框 -->
    <FormModal
      v-model:show="showCreateModal"
      :title="'创建菜单'"
      :loading="submitting"
      size="lg"
      @submit="closeModal"
      @close="closeModal"
    >
      <FormField
        v-model="newMenuItem.id"
        label="ID"
        placeholder="唯一标识符"
        required
        :inline="true"
      />
      
      <FormField
        v-model="newMenuItem.title"
        label="标题"
        placeholder="菜单标题"
        required
        :inline="true"
      />
      
      <FormField
        v-model="newMenuItem.path"
        label="路径"
        placeholder="/path/to/page"
        :inline="true"
      />
      
      <div class="form-field form-field-inline">
        <label class="inline-label text-sm font-medium text-gray-700 after:content-[' *'] after:text-red-500">
          图标
        </label>
        <div class="inline-input">
          <SimpleIconPicker 
            v-model="newMenuItem.icon" 
            size="md"
            show-label
          />
        </div>
      </div>
      
      <FormField
        v-model="newMenuItem.description"
        label="描述"
        type="textarea"
        placeholder="菜单描述"
        :rows="2"
        :inline="true"
      />
      
      <div class="form-field form-field-inline">
        <label class="inline-label text-sm font-medium text-gray-700">权限</label>
        <div class="inline-input">
          <div class="flex space-x-2 mb-2">
            <input
              v-model="permissionInput"
              type="text"
              placeholder="输入权限代码"
              class="input-field flex-1"
              @keyup.enter="addPermission"
            />
            <button @click="addPermission" class="btn-secondary">添加</button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="permission in newMenuItem.permissions" 
              :key="permission"
              class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded flex items-center space-x-1"
            >
              <span>{{ permission }}</span>
              <button @click="removePermission(permission)" class="text-blue-600 hover:text-blue-800">×</button>
            </span>
          </div>
        </div>
      </div>
      
      <FormField
        v-model="newMenuItem.order"
        label="排序"
        type="number"
        :min="1"
        :inline="true"
      />
      
      <FormField
        v-model="newMenuItem.enabled"
        label="状态"
        type="checkbox"
        placeholder="启用此菜单"
        :inline="true"
      />
    </FormModal>

    <FormModal
      v-model:show="showEditModal"
      :title="'编辑菜单'"
      :loading="submitting"
      size="lg"
      @submit="closeModal"
      @close="closeModal"
    >
      <p>编辑功能待实现</p>
    </FormModal>

    <!-- 确认删除对话框 -->
    <ConfirmDialog
      v-model:show="showDeleteDialog"
      :title="`删除${deleteTarget?.type === 'group' ? '菜单分组' : '菜单项'}`"
      :message="`确认要删除${deleteTarget?.type === 'group' ? '分组' : '菜单项'} 「${deleteTarget?.item?.title || deleteTarget?.group?.title}」 吗？此操作不可恢复。`"
      type="error"
      confirm-text="删除"
      :loading="submitting"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<style scoped>
/* Form field styles for consistent label alignment */
.form-field {
  @apply mb-3;
}

.form-field-inline {
  @apply flex items-start mb-4;
  gap: 12px;
}

.inline-label {
  @apply flex-shrink-0 pt-2 text-right;
  width: 80px !important;
}

.inline-input {
  @apply flex-1;
}

:deep(.vxe-table) {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

:deep(.vxe-table .vxe-header--column) {
  background-color: #f8fafc;
  color: #374151;
  font-weight: 600;
  font-size: 13px;
}

:deep(.vxe-table .vxe-body--row:hover) {
  background-color: #f0f9ff;
}

:deep(.vxe-table .vxe-body--column) {
  padding: 8px 12px;
  font-size: 13px;
  color: #374151;
}

:deep(.vxe-table .vxe-tree--indent) {
  width: 16px;
}

:deep(.vxe-table .vxe-tree--node-btn) {
  color: #6b7280;
  font-size: 14px;
}

:deep(.vxe-table .vxe-tree--line-wrapper) {
  border-color: #d1d5db;
}

:deep(.vxe-table .vxe-checkbox--icon) {
  color: #3b82f6;
}

:deep(.vxe-table .vxe-cell--checkbox .vxe-checkbox--icon.is--checked) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}
</style>