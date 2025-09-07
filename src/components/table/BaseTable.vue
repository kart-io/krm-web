<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, watch } from 'vue'
import type { VxeTableInstance, VxeColumnProps, VxeTableProps } from 'vxe-table'

interface BaseTableProps {
  data?: T[]
  columns: VxeColumnProps[]
  loading?: boolean
  height?: string | number
  maxHeight?: string | number
  showCheckbox?: boolean
  showSeq?: boolean
  showToolbar?: boolean
  toolbarConfig?: any
  pagerConfig?: any
  sortConfig?: any
  filterConfig?: any
  resizable?: boolean
  stripe?: boolean
  border?: boolean
  size?: 'mini' | 'small' | 'medium'
  emptyText?: string
  rowKey?: string
}

const props = withDefaults(defineProps<BaseTableProps>(), {
  data: () => [],
  loading: false,
  height: 'auto',
  showCheckbox: false,
  showSeq: false,
  showToolbar: false,
  resizable: true,
  stripe: true,
  border: true,
  size: 'small',
  emptyText: '暂无数据',
  rowKey: 'id'
})

const emit = defineEmits<{
  'selection-change': [selection: T[]]
  'row-click': [params: { row: T, rowIndex: number, $rowIndex: number }]
  'row-dblclick': [params: { row: T, rowIndex: number, $rowIndex: number }]
  'cell-click': [params: { row: T, column: any, rowIndex: number, $rowIndex: number }]
  'sort-change': [params: { column: any, field: string, order: string }]
  'filter-change': [params: { column: any, field: string, values: any[] }]
  'page-change': [params: { currentPage: number, pageSize: number }]
}>()

const tableRef = ref<VxeTableInstance<T>>()
const selectedRows = ref<T[]>([])

// 表格配置
const tableConfig = computed<VxeTableProps<T>>(() => ({
  data: props.data,
  height: props.height,
  maxHeight: props.maxHeight,
  loading: props.loading,
  stripe: props.stripe,
  border: props.border,
  size: props.size,
  resizable: props.resizable,
  showOverflow: 'tooltip' as const,
  showHeaderOverflow: 'tooltip' as const,
  rowKey: props.rowKey,
  sortConfig: props.sortConfig || { trigger: 'cell', remote: false },
  filterConfig: props.filterConfig || { remote: false },
  checkboxConfig: props.showCheckbox ? {
    trigger: 'row'
  } : undefined,
  seqConfig: props.showSeq ? {
    seqMethod: ({ rowIndex }) => rowIndex + 1
  } : undefined
}))

// 列配置
const computedColumns = computed<VxeColumnProps[]>(() => {
  const columns: VxeColumnProps[] = []
  
  // 序号列
  if (props.showSeq) {
    columns.push({
      type: 'seq',
      title: '序号',
      width: 60,
      fixed: 'left'
    })
  }
  
  // 复选框列
  if (props.showCheckbox) {
    columns.push({
      type: 'checkbox',
      title: '',
      width: 50,
      fixed: 'left'
    })
  }
  
  // 数据列
  columns.push(...props.columns)
  
  return columns
})

// 工具栏配置
const toolbarConfig = computed(() => {
  if (!props.showToolbar) return null
  
  return {
    refresh: true,
    resizable: true,
    setting: true,
    ...props.toolbarConfig
  }
})

// 分页配置
const pagerConfig = computed(() => {
  if (!props.pagerConfig) return null
  
  return {
    enabled: true,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
    layouts: ['PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total'],
    ...props.pagerConfig
  }
})

// 事件处理
const handleSelectionChange = ({ records }: { records: T[] }) => {
  selectedRows.value = records
  emit('selection-change', records)
}

const handleRowClick = (params: { row: T, rowIndex: number, $rowIndex: number }) => {
  emit('row-click', params)
}

const handleRowDblclick = (params: { row: T, rowIndex: number, $rowIndex: number }) => {
  emit('row-dblclick', params)
}

const handleCellClick = (params: { row: T, column: any, rowIndex: number, $rowIndex: number }) => {
  emit('cell-click', params)
}

const handleSortChange = (params: { column: any, field: string, order: string }) => {
  emit('sort-change', params)
}

const handleFilterChange = (params: { column: any, field: string, values: any[] }) => {
  emit('filter-change', params)
}

const handlePageChange = (params: { currentPage: number, pageSize: number }) => {
  emit('page-change', params)
}

// 暴露方法
const getTableInstance = () => tableRef.value
const getSelectedRows = () => selectedRows.value
const clearSelection = () => tableRef.value?.clearCheckboxRow()
const setAllSelection = () => tableRef.value?.setAllCheckboxRow(true)
const toggleRowSelection = (row: T, selected?: boolean) => {
  if (selected === undefined) {
    tableRef.value?.toggleCheckboxRow(row)
  } else {
    tableRef.value?.setCheckboxRow(row, selected)
  }
}

const refreshTable = () => tableRef.value?.reloadData(props.data)

defineExpose({
  getTableInstance,
  getSelectedRows,
  clearSelection,
  setAllSelection,
  toggleRowSelection,
  refreshTable
})

watch(() => props.data, () => {
  selectedRows.value = []
}, { deep: true })
</script>

<template>
  <div class="base-table">
    <vxe-toolbar 
      v-if="showToolbar" 
      ref="toolbarRef"
      v-bind="toolbarConfig"
    >
      <template #buttons>
        <slot name="toolbar-buttons"></slot>
      </template>
      <template #tools>
        <slot name="toolbar-tools"></slot>
      </template>
    </vxe-toolbar>
    
    <vxe-table
      ref="tableRef"
      v-bind="tableConfig"
      @checkbox-change="handleSelectionChange"
      @checkbox-all="handleSelectionChange"
      @cell-click="handleCellClick"
      @cell-dblclick="handleRowDblclick"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
    >
      <vxe-column
        v-for="(column, index) in computedColumns"
        :key="`column-${column.field || column.type || index}`"
        v-bind="column"
      >
        <template v-if="column.slots?.default" #default="params">
          <slot 
            :name="column.slots.default" 
            :row="params.row" 
            :column="params.column"
            :rowIndex="params.rowIndex"
            :$rowIndex="params.$rowIndex"
          ></slot>
        </template>
        
        <template v-if="column.slots?.header" #header="params">
          <slot 
            :name="column.slots.header" 
            :column="params.column"
            :$columnIndex="params.$columnIndex"
          ></slot>
        </template>
      </vxe-column>
    </vxe-table>
    
    <vxe-pager
      v-if="pagerConfig"
      v-bind="pagerConfig"
      @page-change="handlePageChange"
    />
  </div>
</template>

<style scoped>
.base-table {
  height: 100%;
}

/* 自定义 VxeTable 样式 */
:deep(.vxe-table) {
  font-size: 0.875rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background: white;
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
  transition: all 0.3s ease;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.vxe-table .vxe-body--row:hover) {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.vxe-table .vxe-body--row:nth-child(even)) {
  background-color: #fafbfc;
}

:deep(.vxe-table .vxe-body--row.row--checked) {
  background-color: #eff6ff;
}

:deep(.vxe-table .vxe-body--column) {
  border-right: 1px solid #f3f4f6;
}

:deep(.vxe-table .vxe-cell) {
  padding: 1rem 0.75rem;
  font-size: 0.75rem;
  color: #475569;
  line-height: 1.5;
  font-weight: 500;
}

:deep(.vxe-table .vxe-body--row) {
  min-height: 40px;
}

:deep(.vxe-table .vxe-cell--title) {
  font-size: 0.75rem;
  font-weight: 500;
}

:deep(.vxe-table .vxe-body--column.col--seq) {
  background-color: #fafafa;
  font-weight: 500;
  text-align: center;
}

:deep(.vxe-table .vxe-body--column.col--checkbox) {
  text-align: center;
}

/* 分页样式 */
:deep(.vxe-pager) {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

/* 工具栏样式 */
:deep(.vxe-toolbar) {
  padding: 0.75rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}
</style>