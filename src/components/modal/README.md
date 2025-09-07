# UnifiedModal 组件文档

一个灵活且功能丰富的模态框组件，支持多种布局配置，能够适应不同的使用场景。

## 功能特性

- 🎯 **多样化布局支持**: 支持简单表单、标签页、复杂内容等多种布局
- 🎨 **统一的UI风格**: 所有变体都保持一致的设计语言和用户体验
- 📱 **响应式设计**: 适配各种屏幕尺寸
- ⚡ **高度可配置**: 通过props轻松配置各种选项
- 🔄 **标签页支持**: 内置标签页切换功能
- 📝 **表单集成**: 与FormField组件无缝集成

## 基本用法

```vue
<template>
  <UnifiedModal
    v-model:show="showModal"
    title="模态框标题"
    @submit="handleSubmit"
    @close="handleClose"
  >
    <template #default="{ formInline }">
      <FormField
        v-model="data.field"
        label="字段标签"
        :inline="formInline"
      />
    </template>
  </UnifiedModal>
</template>
```

## Props 配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `show` | `boolean` | `false` | 控制模态框显示/隐藏 |
| `title` | `string` | - | 模态框标题 |
| `loading` | `boolean` | `false` | 提交按钮加载状态 |
| `submitText` | `string` | `'确认'` | 提交按钮文本 |
| `cancelText` | `string` | `'取消'` | 取消按钮文本 |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'lg'` | 模态框尺寸 |
| `persistent` | `boolean` | `false` | 禁止点击背景关闭 |
| `position` | `'center' \| 'top' \| 'bottom'` | `'center'` | 模态框位置 |
| `hasHeader` | `boolean` | `true` | 是否显示头部 |
| `hasTabs` | `boolean` | `false` | 是否启用标签页 |
| `hasFooter` | `boolean` | `true` | 是否显示底部按钮 |
| `headerColor` | `'blue' \| 'gray' \| 'white'` | `'blue'` | 头部背景颜色 |
| `tabs` | `TabItem[]` | - | 标签页配置 |
| `activeTab` | `string` | - | 当前激活的标签页 |
| `formInline` | `boolean` | `true` | 表单是否使用行内布局 |
| `contentPadding` | `boolean` | `true` | 内容区域是否有内边距 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `close` | - | 关闭模态框时触发 |
| `submit` | - | 点击提交按钮时触发 |
| `update:show` | `boolean` | 双向绑定show属性 |
| `update:activeTab` | `string` | 双向绑定activeTab属性 |

## 插槽

### 默认插槽

```vue
<template #default="{ currentTab, switchTab, formInline }">
  <!-- 模态框内容 -->
</template>
```

插槽作用域参数：
- `currentTab`: 当前激活的标签页key
- `switchTab`: 切换标签页的方法
- `formInline`: 是否使用行内表单布局

## 使用场景示例

### 1. 简单表单模态框

```vue
<UnifiedModal
  v-model:show="showSimpleModal"
  title="用户信息"
  size="md"
  @submit="handleSubmit"
>
  <template #default="{ formInline }">
    <FormField v-model="user.name" label="姓名" :inline="formInline" />
    <FormField v-model="user.email" label="邮箱" :inline="formInline" />
  </template>
</UnifiedModal>
```

### 2. 带标签页的复杂表单

```vue
<UnifiedModal
  v-model:show="showTabModal"
  v-model:activeTab="currentTab"
  title="设置"
  size="xl"
  :has-tabs="true"
  :tabs="[
    { key: 'basic', label: '基本设置' },
    { key: 'advanced', label: '高级设置' }
  ]"
  @submit="handleSubmit"
>
  <template #default="{ currentTab, formInline }">
    <div v-if="currentTab === 'basic'">
      <!-- 基本设置内容 -->
    </div>
    <div v-else-if="currentTab === 'advanced'">
      <!-- 高级设置内容 -->
    </div>
  </template>
</UnifiedModal>
```

### 3. 自定义头部颜色

```vue
<UnifiedModal
  v-model:show="showCustomModal"
  title="系统通知"
  header-color="gray"
  :has-footer="false"
>
  <template #default>
    <div class="text-center py-8">
      <p>这是一个信息通知模态框</p>
    </div>
  </template>
</UnifiedModal>
```

### 4. 无头部和底部的内容模态框

```vue
<UnifiedModal
  v-model:show="showContentModal"
  :has-header="false"
  :has-footer="false"
  :content-padding="false"
  size="2xl"
>
  <template #default>
    <div class="custom-content">
      <!-- 完全自定义的内容 -->
    </div>
  </template>
</UnifiedModal>
```

## 样式定制

组件使用Tailwind CSS类构建，可以通过以下方式进行样式定制：

1. **全局样式覆盖**: 在全局CSS中覆盖组件样式
2. **插槽内容样式**: 在插槽内容中使用自定义样式
3. **主题配置**: 通过headerColor等props配置主题色彩

## 最佳实践

1. **响应式设计**: 在不同屏幕尺寸下选择合适的size
2. **表单验证**: 结合FormField组件的error属性进行表单验证
3. **加载状态**: 合理使用loading状态提升用户体验
4. **键盘操作**: 组件自动支持ESC键关闭
5. **焦点管理**: 模态框打开时自动管理焦点和滚动锁定

## TypeScript 支持

组件完全支持TypeScript，提供完整的类型定义：

```typescript
interface TabItem {
  key: string
  label: string
  disabled?: boolean
}
```

## 兼容性

- Vue 3.x+
- TypeScript 4.x+
- 现代浏览器 (支持ES2020+)