<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { mockConfig } from '../services/config'

const isOpen = ref(false)
const mockEnabled = ref(false)
const debugInfo = ref({})

const configSource = computed(() => {
  return mockConfig.getConfigSource()
})

const statusColor = computed(() => {
  return mockEnabled.value ? 'text-green-600' : 'text-red-600'
})

const statusBgColor = computed(() => {
  return mockEnabled.value ? 'bg-green-100' : 'bg-red-100'
})

const loadConfig = () => {
  mockEnabled.value = mockConfig.isMockEnabled()
  debugInfo.value = mockConfig.getDebugInfo()
}

const toggleMock = (enabled: boolean) => {
  mockConfig.setMockEnabled(enabled)
}

const resetConfig = () => {
  mockConfig.resetMockConfig()
  loadConfig()
}

onMounted(() => {
  loadConfig()
})

// Only show in development mode
const isDev = import.meta.env.DEV
</script>

<template>
  <!-- Development Only Mock Config Panel -->
  <div v-if="isDev" class="fixed bottom-4 right-4 z-50">
    <!-- Toggle Button -->
    <button
      @click="isOpen = !isOpen"
      :class="[
        'mb-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center space-x-2 text-sm font-semibold',
        mockEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700',
        'text-white'
      ]"
      :title="`Mock Mode: ${mockEnabled ? 'ON' : 'OFF'} (Click to configure)`"
    >
      <div :class="['w-2 h-2 rounded-full', mockEnabled ? 'bg-green-300' : 'bg-red-300']"></div>
      <span>{{ mockEnabled ? 'MOCK' : 'API' }}</span>
      <svg 
        :class="['w-4 h-4 transition-transform', isOpen ? 'rotate-180' : '']" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Config Panel -->
    <div 
      v-show="isOpen" 
      class="bg-white rounded-lg shadow-xl border p-6 w-80 transform transition-all duration-200"
      :class="isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Mock Configuration</h3>
        <button 
          @click="isOpen = false"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Current Status -->
      <div :class="['p-3 rounded-lg mb-4', statusBgColor]">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700">Current Mode:</span>
          <span :class="['text-sm font-bold', statusColor]">
            {{ mockEnabled ? 'MOCK DATA' : 'REAL API' }}
          </span>
        </div>
        <div class="text-xs text-gray-600 mt-1">
          Source: {{ configSource }}
        </div>
      </div>

      <!-- Toggle Controls -->
      <div class="space-y-3 mb-4">
        <button
          @click="toggleMock(true)"
          :class="[
            'w-full p-3 rounded-lg text-sm font-medium transition-all',
            mockEnabled 
              ? 'bg-green-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          🎭 Enable Mock Mode
          <div class="text-xs mt-1 opacity-80">Use generated test data</div>
        </button>
        
        <button
          @click="toggleMock(false)"
          :class="[
            'w-full p-3 rounded-lg text-sm font-medium transition-all',
            !mockEnabled 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          🌐 Enable API Mode
          <div class="text-xs mt-1 opacity-80">Connect to real backend</div>
        </button>
      </div>

      <!-- Debug Info -->
      <details class="mb-4">
        <summary class="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
          Debug Information
        </summary>
        <div class="mt-2 text-xs bg-gray-50 p-3 rounded font-mono">
          <pre>{{ JSON.stringify(debugInfo, null, 2) }}</pre>
        </div>
      </details>

      <!-- Quick Actions -->
      <div class="flex space-x-2">
        <button
          @click="resetConfig"
          class="flex-1 px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          Reset Config
        </button>
        <button
          @click="loadConfig"
          class="flex-1 px-3 py-2 text-xs bg-kubernetes-100 text-kubernetes-700 rounded hover:bg-kubernetes-200 transition-colors"
        >
          Refresh Status
        </button>
      </div>

      <!-- URL Hint -->
      <div class="mt-4 p-3 bg-blue-50 rounded-lg">
        <div class="text-xs text-blue-800">
          <strong>💡 Tip:</strong> You can also control Mock mode via URL:
          <div class="mt-1 font-mono text-blue-600">
            ?mock=true or ?mock=false
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure panel appears above everything */
.z-50 {
  z-index: 9999;
}

/* Smooth panel animation */
.transform {
  transform-origin: bottom right;
}

/* Custom scrollbar for debug info */
pre {
  max-height: 150px;
  overflow-y: auto;
}

pre::-webkit-scrollbar {
  width: 4px;
}

pre::-webkit-scrollbar-track {
  background: #f1f1f1;
}

pre::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

pre::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>