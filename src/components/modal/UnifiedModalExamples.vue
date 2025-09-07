<script setup lang="ts">
import { ref, computed } from 'vue'
import UnifiedModal from './UnifiedModal.vue'
import FormField from '../form/FormField.vue'

// Modal visibility states
const showModal1 = ref(false)
const showModal2 = ref(false) 
const showModal3 = ref(false)

// Tab states
const modal1Tab = ref('settings')
const modal3Tab = ref('消费配置')

// Form data
const gameData = ref({
  scene: '直播',
  title: '',
  description: '',
  entryInfo: '进度',
  backgroundType: 'png',
  backgroundImage: '',
  colors: [
    { id: 1, name: '颜色1', description: '任务描述、礼物名称、奖励标题、奖励各称及数量、结果弹窗上所有文案、结束弹窗上的奖励数量的颜色', selected: true },
    { id: 2, name: '颜色2', description: '玩法标题颜色', selected: false },
    { id: 3, name: '颜色3', description: '有效期颜色', selected: false },
    { id: 4, name: '颜色4', description: '进度条颜色', selected: false },
    { id: 5, name: '颜色5', description: '任务类目显示颜色', selected: false }
  ]
})

const rightsData = ref({
  type: '',
  discount: '',
  icon: '',
  link: '',
  weight: ''
})

const consumptionData = ref({
  amount: 1000,
  rewards: [
    {
      type: '',
      quantity: 1
    }
  ]
})

// Modal 1 tabs configuration
const modal1Tabs = [
  { key: 'settings', label: '设置' },
  { key: 'treasure', label: '宝箱设置' },
  { key: 'users', label: '用户设置' },
  { key: 'landlord', label: '房主设置' }
]

// Modal 3 tabs configuration  
const modal3Tabs = [
  { key: '消费配置', label: '消费配置' },
  { key: '用户条件', label: '用户条件' }
]

const addColor = () => {
  gameData.value.colors.push({
    id: Date.now(),
    name: `颜色${gameData.value.colors.length + 1}`,
    description: '',
    selected: false
  })
}

const removeColor = (colorId: number) => {
  gameData.value.colors = gameData.value.colors.filter(c => c.id !== colorId)
}

const addReward = () => {
  consumptionData.value.rewards.push({
    type: '',
    quantity: 1
  })
}

const removeReward = (index: number) => {
  consumptionData.value.rewards.splice(index, 1)
}

// Form validation
const isFormValid = computed(() => {
  return consumptionData.value.rewards.every(reward => 
    reward.type && reward.quantity > 0
  )
})
</script>

<template>
  <div class="p-8 space-y-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">统一模态框组件示例</h2>
    
    <!-- 示例按钮 -->
    <div class="flex space-x-4">
      <button 
        @click="showModal1 = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        游戏设置模态框 (复杂表单+标签页)
      </button>
      
      <button 
        @click="showModal2 = true"
        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        权益设置模态框 (简单表单)
      </button>
      
      <button 
        @click="showModal3 = true"
        class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
      >
        消费配置模态框 (标签页+动态表单)
      </button>
    </div>

    <!-- 模态框 1: 游戏设置 (复杂表单) -->
    <UnifiedModal
      v-model:show="showModal1"
      v-model:activeTab="modal1Tab"
      title="新增"
      size="xl"
      :has-tabs="true"
      :tabs="modal1Tabs"
      header-color="blue"
      @submit="showModal1 = false"
      @close="showModal1 = false"
    >
      <template #default="{ currentTab, formInline }">
        <div class="space-y-6">
          <!-- 设置标签页 -->
          <div v-if="currentTab === 'settings'">
            <div class="space-y-4">
              <div class="flex space-x-4 mb-4">
                <label class="flex items-center space-x-2">
                  <span class="text-red-500">*</span>
                  <span class="text-sm font-medium">使用的场景</span>
                </label>
                <div class="flex space-x-4">
                  <label class="flex items-center space-x-2">
                    <input v-model="gameData.scene" type="radio" value="直播" class="form-radio">
                    <span>直播</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input v-model="gameData.scene" type="radio" value="语聊" class="form-radio">
                    <span>语聊</span>
                  </label>
                </div>
              </div>

              <FormField
                v-model="gameData.title"
                label="玩法标题"
                placeholder="标题不超过15个中文的长度"
                required
                :inline="formInline"
                error="标题不超过15个中文的长度"
              />

              <FormField
                v-model="gameData.description"
                label="玩法说明"
                type="textarea"
                :rows="3"
                :inline="formInline"
              />

              <div class="form-field form-field-inline">
                <label class="inline-label text-sm font-medium text-gray-700 after:content-[' *'] after:text-red-500">
                  玩法入口展示信息
                </label>
                <div class="inline-input">
                  <div class="flex space-x-4">
                    <label class="flex items-center space-x-2">
                      <input v-model="gameData.entryInfo" type="radio" value="进度" class="form-radio">
                      <span>进度</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input v-model="gameData.entryInfo" type="radio" value="倒计时" class="form-radio">
                      <span>倒计时</span>
                    </label>
                  </div>
                </div>
              </div>

              <FormField
                v-model="gameData.backgroundType"
                label="玩法背景图类型"
                type="select"
                :options="[
                  { label: 'PNG', value: 'png' },
                  { label: 'JPG', value: 'jpg' },
                  { label: 'GIF', value: 'gif' }
                ]"
                required
                :inline="formInline"
              />

              <div class="form-field form-field-inline">
                <label class="inline-label text-sm font-medium text-gray-700 after:content-[' *'] after:text-red-500">
                  玩法背景图
                </label>
                <div class="inline-input">
                  <button class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100">
                    📤 上传
                  </button>
                </div>
              </div>

              <!-- 颜色配置 -->
              <div class="space-y-3">
                <div v-for="(color, index) in gameData.colors" :key="color.id" class="form-field form-field-inline">
                  <label class="inline-label text-sm font-medium text-gray-700 after:content-[' *'] after:text-red-500">
                    {{ color.name }} 
                    <button v-if="index > 0" @click="removeColor(color.id)" class="ml-2 text-red-500 hover:text-red-700">
                      ❌
                    </button>
                  </label>
                  <div class="inline-input">
                    <FormField
                      v-model="color.description"
                      label=""
                      :placeholder="color.description || '输入颜色描述'"
                      :inline="false"
                    />
                  </div>
                </div>
                <button @click="addColor" class="text-sm text-blue-600 hover:text-blue-800">+ 添加颜色</button>
              </div>
            </div>
          </div>

          <!-- 其他标签页内容 -->
          <div v-else-if="currentTab === 'treasure'" class="text-center py-8 text-gray-500">
            宝箱设置功能待开发
          </div>
          <div v-else-if="currentTab === 'users'" class="text-center py-8 text-gray-500">
            用户设置功能待开发
          </div>
          <div v-else-if="currentTab === 'landlord'" class="text-center py-8 text-gray-500">
            房主设置功能待开发
          </div>
        </div>
      </template>
    </UnifiedModal>

    <!-- 模态框 2: 权益设置 (简单表单) -->
    <UnifiedModal
      v-model:show="showModal2"
      title="新增"
      size="lg"
      :has-tabs="false"
      header-color="blue"
      @submit="showModal2 = false"
      @close="showModal2 = false"
    >
      <template #default="{ formInline }">
        <div class="space-y-4">
          <FormField
            v-model="rightsData.type"
            label="权益类型"
            type="select"
            placeholder="请选择权益类型"
            required
            :inline="formInline"
            :options="[
              { label: '折扣券', value: 'discount' },
              { label: '积分奖励', value: 'points' },
              { label: '免费试用', value: 'trial' }
            ]"
          />

          <FormField
            v-model="rightsData.discount"
            label="折扣"
            placeholder="请输入"
            required
            :inline="formInline"
          />

          <div class="form-field form-field-inline">
            <label class="inline-label text-sm font-medium text-gray-700 after:content-[' *'] after:text-red-500">
              权益icon
            </label>
            <div class="inline-input">
              <button class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100">
                📤 上传
              </button>
            </div>
          </div>

          <FormField
            v-model="rightsData.link"
            label="链接"
            placeholder="请输入链接"
            :inline="formInline"
          />

          <FormField
            v-model="rightsData.weight"
            label="权重"
            placeholder="请输入权重,越大越前"
            :inline="formInline"
            help="权重值越大，显示顺序越靠前"
          />
        </div>
      </template>
    </UnifiedModal>

    <!-- 模态框 3: 消费配置 (标签页+动态表单) -->
    <UnifiedModal
      v-model:show="showModal3"
      v-model:activeTab="modal3Tab"
      title="新增"
      size="xl"
      :has-tabs="true"
      :tabs="modal3Tabs"
      header-color="blue"
      @submit="showModal3 = false"
      @close="showModal3 = false"
    >
      <template #default="{ currentTab, formInline }">
        <div class="space-y-6">
          <!-- 消费配置标签页 -->
          <div v-if="currentTab === '消费配置'">
            <div class="bg-blue-600 text-white px-3 py-2 rounded-t-md text-sm font-medium mb-4">
              消费额度1
            </div>
            
            <div class="border border-gray-200 rounded-b-md p-4 space-y-4">
              <FormField
                v-model="consumptionData.amount"
                label="消费额度 (金币)"
                type="number"
                placeholder="1,000"
                required
                :inline="formInline"
                help="设置消费金币数量"
              />

              <div class="space-y-4">
                <h4 class="text-sm font-medium text-gray-700">奖励配置</h4>
                
                <div class="flex items-center space-x-2 mb-3">
                  <span class="bg-blue-600 text-white text-xs px-2 py-1 rounded">1</span>
                  <span class="text-sm text-gray-600">选择奖励1</span>
                  <div class="text-xs text-gray-400 space-x-4">
                    <button class="hover:text-gray-600">↑</button>
                    <button class="hover:text-gray-600">↓</button>
                    <button class="hover:text-red-600">✕</button>
                  </div>
                </div>

                <div v-for="(reward, index) in consumptionData.rewards" :key="index" class="space-y-3 border-l-2 border-blue-100 pl-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-600">奖励 {{ index + 1 }}</span>
                    <button 
                      v-if="consumptionData.rewards.length > 1"
                      @click="removeReward(index)" 
                      class="text-red-500 hover:text-red-700 text-sm"
                    >
                      删除
                    </button>
                  </div>
                  
                  <FormField
                    v-model="reward.type"
                    label="奖励类型"
                    type="select"
                    placeholder="请选择奖励类型"
                    required
                    :inline="formInline"
                    :options="[
                      { label: '积分', value: 'points' },
                      { label: '优惠券', value: 'coupon' },
                      { label: '礼品', value: 'gift' }
                    ]"
                  />

                  <FormField
                    v-model="reward.quantity"
                    label="奖励数量"
                    type="number"
                    :min="1"
                    required
                    :inline="formInline"
                  />
                </div>

                <button @click="addReward" class="text-sm text-blue-600 hover:text-blue-800">
                  + 添加奖励
                </button>
              </div>

              <div v-if="!isFormValid" class="text-center py-4 bg-red-50 rounded-md border border-red-200">
                <p class="text-red-600 text-sm flex items-center justify-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  请先完善已添加的奖励信息
                </p>
              </div>
            </div>
          </div>

          <!-- 用户条件标签页 -->
          <div v-else-if="currentTab === '用户条件'" class="text-center py-8 text-gray-500">
            用户条件配置功能待开发
          </div>
        </div>
      </template>
    </UnifiedModal>
  </div>
</template>

<style scoped>
.form-radio {
  @apply h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500;
}
</style>