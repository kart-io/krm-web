<template>
  <div class="universal-table-view">
    <div class="container">
      <!-- 搜索区域 -->
      <div class="search-section" v-if="searchFields.length > 0">
        <div class="search-fields">
          <div
            v-for="field in searchFields"
            :key="field.key"
            class="search-field-inline"
          >
            <label>{{ field.label }}：</label>
            <input
              v-if="field.type === 'input'"
              v-model="searchValues[field.key]"
              type="text"
              :placeholder="field.placeholder"
              class="search-input"
            />
            <select
              v-else-if="field.type === 'select'"
              v-model="searchValues[field.key]"
              class="search-select"
            >
              <option value="">请选择</option>
              <option
                v-for="option in field.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="search-actions">
          <button @click="handleReset" class="btn-secondary">重置</button>
          <button @click="handleSearch" class="btn-primary">查询</button>
        </div>
      </div>

      <!-- 标题和操作区域 -->
      <div class="title-section">
        <h2 class="page-title">{{ title }}</h2>
        <button
          v-if="showAddButton"
          @click="handleAdd"
          class="btn-primary"
        >
          {{ addButtonText }}
        </button>
      </div>

      <!-- 表格区域 -->
      <div class="table-wrapper">
        <vxe-table 
          :data="tableData" 
          border 
          stripe
          :height="tableHeight"
          size="mini"
          show-overflow="tooltip"
          @checkbox-change="handleSelectionChange"
          @checkbox-all="handleSelectAll"
        >
          <vxe-column v-if="showCheckbox" type="checkbox" width="50"></vxe-column>
          <vxe-column v-if="showSeqNumber" type="seq" title="序号" width="60"></vxe-column>
          
          <vxe-column
            v-for="column in columns"
            :key="column.field"
            :field="column.field"
            :title="column.title"
            :width="column.width"
            :min-width="column.minWidth"
            :align="column.align"
            :fixed="column.fixed"
            :sortable="column.sortable"
            :sort-by="column.sortBy"
          >
            <template #default="{ row }" v-if="column.slot">
              <slot :name="column.slot" :row="row" :value="row[column.field]">
                {{ row[column.field] }}
              </slot>
            </template>
          </vxe-column>
          
          <vxe-column title="操作" :width="actionsWidth" fixed="right" v-if="actions.length > 0">
            <template #default="{ row }">
              <div class="actions">
                <button
                  v-for="action in actions"
                  :key="action.key"
                  @click="handleAction(action.key, row)"
                  :class="['btn', `btn-${action.type}`]"
                >
                  {{ action.label }}
                </button>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// 通用接口定义
export interface SearchField {
  key: string
  label: string
  type: 'input' | 'select'
  placeholder?: string
  options?: Array<{ label: string; value: string | number }>
}

export interface TableColumn {
  field: string
  title: string
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  slot?: string
  sortable?: boolean
  sortBy?: string
}

export interface TableAction {
  key: string
  label: string
  type: 'info' | 'primary' | 'danger' | 'warning'
}

// Props 定义
interface Props<T = Record<string, any>> {
  title: string
  tableData: T[]
  columns: TableColumn[]
  searchFields?: SearchField[]
  actions?: TableAction[]
  showAddButton?: boolean
  addButtonText?: string
  tableHeight?: number | string
  actionsWidth?: number | string
  apiMethod?: (params: Record<string, any>) => Promise<any>
  showCheckbox?: boolean
  showSeqNumber?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  searchFields: () => [],
  actions: () => [
    { key: 'view', label: '查看', type: 'info' },
    { key: 'edit', label: '编辑', type: 'primary' },
    { key: 'delete', label: '删除', type: 'danger' }
  ],
  showAddButton: true,
  addButtonText: '新增',
  tableHeight: 500,
  actionsWidth: 200,
  showCheckbox: true,
  showSeqNumber: true
})

// Emits 定义
const emit = defineEmits<{
  search: [params: Record<string, any>]
  reset: []
  add: []
  action: [actionKey: string, row: any]
  'selection-change': [selection: any[]]
  'select-all': [selection: any[]]
}>()

// 搜索值的响应式对象
const searchValues = reactive<Record<string, any>>({})

// 初始化搜索值
props.searchFields.forEach(field => {
  searchValues[field.key] = ''
})

// 搜索处理
const handleSearch = async () => {
  const params = { ...searchValues }
  emit('search', params)
  
  if (props.apiMethod) {
    try {
      const result = await props.apiMethod(params)
      console.log('搜索结果:', result)
    } catch (error) {
      console.error('搜索失败:', error)
    }
  }
}

// 重置搜索
const handleReset = () => {
  props.searchFields.forEach(field => {
    searchValues[field.key] = ''
  })
  emit('reset')
}

// 新增处理
const handleAdd = () => {
  emit('add')
}

// 操作处理
const handleAction = (actionKey: string, row: Record<string, any>) => {
  emit('action', actionKey, row)
}

// 选择处理
const handleSelectionChange = (params: any) => {
  emit('selection-change', params.records || [])
}

const handleSelectAll = (params: any) => {
  emit('select-all', params.records || [])
}
</script>

<style scoped>
.universal-table-view {
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100vh;
}

.container {
  max-width: 1600px;
  margin: 0 auto;
}

/* 搜索区域样式 */
.search-section {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 1.25rem 1.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: end;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.search-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
}

.search-field-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-field-inline label {
  font-size: 0.875rem;
  color: #475569;
  font-weight: 600;
  white-space: nowrap;
  min-width: auto;
}

.search-input,
.search-select {
  padding: 0.625rem 0.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.875rem;
  width: 200px;
  height: 38px;
  background: white;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-input:focus,
.search-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: #fefefe;
}

.search-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-secondary {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  color: #475569;
  border: 1px solid #cbd5e1;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  height: 38px;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  border-color: #94a3b8;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 标题区域样式 */
.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.page-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

.table-wrapper {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
}

.btn-info {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 3px rgba(6, 182, 212, 0.2);
}

.btn-info:hover {
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(6, 182, 212, 0.3);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.2);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 3px rgba(239, 68, 68, 0.2);
}

.btn-danger:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 3px rgba(245, 158, 11, 0.2);
}

.btn-warning:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
}

/* VxeTable 样式覆盖 */
:deep(.vxe-table) {
  font-size: 0.875rem;
  border-radius: 0.5rem;
  overflow: hidden;
}

:deep(.vxe-table .vxe-header--row .vxe-header--column) {
  background: #f1f5f9;
  color: #1e293b;
  font-weight: 600;
  font-size: 0.75rem;
  text-align: center;
  border-bottom: 2px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  padding: 0.75rem 0.5rem;
}

:deep(.vxe-table .vxe-body--row) {
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
}

:deep(.vxe-table .vxe-body--row:hover) {
  background: #f8fafc;
}

:deep(.vxe-table .vxe-body--row:nth-child(even)) {
  background-color: #fafbfc;
}

:deep(.vxe-table .vxe-body--column) {
  border-right: 1px solid #f3f4f6;
}

:deep(.vxe-table .vxe-cell) {
  padding: 0.75rem 0.5rem;
  font-size: 0.75rem;
  color: #475569;
  line-height: 1.5;
}
</style>