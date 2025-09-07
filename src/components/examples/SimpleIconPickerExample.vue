<template>
  <div class="p-6 space-y-6 max-w-2xl">
    <h2 class="text-xl font-bold text-gray-900">SimpleIconPicker 使用示例</h2>
    
    <div class="space-y-4">
      <!-- 基本用法 -->
      <div class="border border-gray-200 rounded-lg p-4">
        <h3 class="text-base font-semibold text-gray-900 mb-3">基本用法</h3>
        <div class="space-y-3">
          <div class="flex items-center space-x-3">
            <label class="text-sm font-medium text-gray-700 w-16">默认:</label>
            <SimpleIconPicker v-model="basicIcon" />
            <span class="text-sm text-gray-500">选中: {{ basicIcon || '未选择' }}</span>
          </div>
        </div>
      </div>

      <!-- 不同尺寸 -->
      <div class="border border-gray-200 rounded-lg p-4">
        <h3 class="text-base font-semibold text-gray-900 mb-3">不同尺寸</h3>
        <div class="space-y-3">
          <div class="flex items-center space-x-3">
            <label class="text-sm font-medium text-gray-700 w-16">小号:</label>
            <SimpleIconPicker v-model="smallIcon" size="sm" />
            <span class="text-sm text-gray-500">{{ smallIcon || '未选择' }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <label class="text-sm font-medium text-gray-700 w-16">中号:</label>
            <SimpleIconPicker v-model="mediumIcon" size="md" />
            <span class="text-sm text-gray-500">{{ mediumIcon || '未选择' }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <label class="text-sm font-medium text-gray-700 w-16">大号:</label>
            <SimpleIconPicker v-model="largeIcon" size="lg" />
            <span class="text-sm text-gray-500">{{ largeIcon || '未选择' }}</span>
          </div>
        </div>
      </div>

      <!-- 显示标签 -->
      <div class="border border-gray-200 rounded-lg p-4">
        <h3 class="text-base font-semibold text-gray-900 mb-3">显示标签</h3>
        <div class="space-y-3">
          <div class="flex items-center space-x-3">
            <label class="text-sm font-medium text-gray-700 w-16">带标签:</label>
            <SimpleIconPicker v-model="labelIcon" size="md" show-label />
          </div>
        </div>
      </div>

      <!-- 表单中使用 -->
      <div class="border border-gray-200 rounded-lg p-4">
        <h3 class="text-base font-semibold text-gray-900 mb-3">表单中使用</h3>
        <form class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">菜单名称</label>
            <input 
              v-model="formData.name"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-kubernetes-500"
              placeholder="输入菜单名称"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">菜单图标</label>
            <SimpleIconPicker v-model="formData.icon" size="md" show-label />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea 
              v-model="formData.description"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-kubernetes-500"
              rows="2"
              placeholder="输入描述信息"
            ></textarea>
          </div>
        </form>
        
        <div class="mt-4 p-3 bg-gray-50 rounded text-sm">
          <strong>表单数据:</strong>
          <pre class="mt-1 text-xs">{{ JSON.stringify(formData, null, 2) }}</pre>
        </div>
      </div>

      <!-- 代码示例 -->
      <div class="border border-gray-200 rounded-lg p-4">
        <h3 class="text-base font-semibold text-gray-900 mb-3">代码示例</h3>
        <div class="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
<pre><code>&lt;!-- 基本用法 --&gt;
&lt;SimpleIconPicker v-model="icon" /&gt;

&lt;!-- 不同尺寸 --&gt;
&lt;SimpleIconPicker v-model="icon" size="sm" /&gt;
&lt;SimpleIconPicker v-model="icon" size="md" /&gt;
&lt;SimpleIconPicker v-model="icon" size="lg" /&gt;

&lt;!-- 显示标签 --&gt;
&lt;SimpleIconPicker v-model="icon" show-label /&gt;

&lt;!-- 在表单中使用 --&gt;
&lt;div class="form-field"&gt;
  &lt;label&gt;图标&lt;/label&gt;
  &lt;SimpleIconPicker v-model="formData.icon" size="md" show-label /&gt;
&lt;/div&gt;</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import SimpleIconPicker from '../SimpleIconPicker.vue'

// 基本用法
const basicIcon = ref('')

// 不同尺寸
const smallIcon = ref('🏠')
const mediumIcon = ref('lucide:Settings')
const largeIcon = ref('📊')

// 显示标签
const labelIcon = ref('⚙️')

// 表单数据
const formData = reactive({
  name: '系统设置',
  icon: '🔧',
  description: '系统配置和管理功能'
})
</script>