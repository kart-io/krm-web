<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { Layout, Button, Dropdown, Menu, Avatar, Tooltip } from 'ant-design-vue'
import { useAuthStore } from './stores/auth'
import MockConfigPanel from './components/MockConfigPanel.vue'
import Sidebar from './components/Sidebar.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import Icon from './components/IconRenderer.vue'

const { Sider, Header, Content } = Layout

const authStore = useAuthStore()
const router = useRouter()

// 侧边栏状态
const collapsed = ref(false)
const sidebarWidth = 256
const collapsedWidth = 80

// 全屏状态
const isFullscreen = ref(false)

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}

const handleRefresh = () => {
  window.location.reload()
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// 监听全屏状态变化
document.addEventListener('fullscreenchange', () => {
  isFullscreen.value = !!document.fullscreenElement
})
</script>

<template>
  <div class="app-container">
    <!-- 登录页面 - 全屏显示 -->
    <div v-if="!authStore.isAuthenticated" class="login-container">
      <RouterView />
    </div>

    <!-- 主应用布局 - Vben Admin 风格 -->
    <Layout v-else class="app-layout">
      <!-- 侧边栏 -->
      <Sider
        v-model:collapsed="collapsed"
        :width="sidebarWidth"
        :collapsedWidth="collapsedWidth"
        class="app-sider"
        theme="light"
      >
        <div class="sider-content">
          <Sidebar />
        </div>
      </Sider>

      <!-- 主内容布局 -->
      <Layout class="main-layout">
        <!-- 顶部Header -->
        <Header class="app-header">
          <div class="header-content">
            <!-- 左侧：折叠按钮 + Logo + 标题 -->
            <div class="header-left">
              <Button 
                type="text" 
                @click="toggleSidebar"
                class="trigger-btn"
              >
                <Icon :icon="collapsed ? 'ant-design:menu-unfold-outlined' : 'ant-design:menu-fold-outlined'" />
              </Button>
              
              <div class="logo-section">
                <h1 class="app-title">KubeEasy</h1>
                <span class="app-subtitle">Kubernetes Made Simple</span>
              </div>
            </div>
            
            <!-- 右侧：工具栏 + 用户信息 -->
            <div class="header-right">
              <!-- 工具栏 -->
              <div class="toolbar">
                <Tooltip title="刷新">
                  <Button type="text" @click="handleRefresh" class="toolbar-btn">
                    <Icon icon="ant-design:reload-outlined" />
                  </Button>
                </Tooltip>
                
                <Tooltip title="全屏">
                  <Button type="text" @click="toggleFullscreen" class="toolbar-btn">
                    <Icon :icon="isFullscreen ? 'ant-design:fullscreen-exit-outlined' : 'ant-design:fullscreen-outlined'" />
                  </Button>
                </Tooltip>
              </div>
              
              <!-- 用户下拉菜单 -->
              <Dropdown>
                <div class="user-dropdown">
                  <Avatar size="small" :style="{ backgroundColor: '#1677ff' }">
                    {{ authStore.user?.username?.charAt(0).toUpperCase() }}
                  </Avatar>
                  <span class="username">{{ authStore.user?.username }}</span>
                  <Icon icon="ant-design:down-outlined" class="dropdown-icon" />
                </div>
                
                <template #overlay>
                  <Menu>
                    <Menu.Item key="profile">
                      <Icon icon="ant-design:user-outlined" class="mr-2" />
                      个人中心
                    </Menu.Item>
                    <Menu.Item key="settings">
                      <Icon icon="ant-design:setting-outlined" class="mr-2" />
                      系统设置
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="logout" @click="handleLogout">
                      <Icon icon="ant-design:logout-outlined" class="mr-2" />
                      退出登录
                    </Menu.Item>
                  </Menu>
                </template>
              </Dropdown>
            </div>
          </div>
        </Header>

        <!-- 面包屑导航 -->
        <div class="breadcrumb-container">
          <Breadcrumb />
        </div>

        <!-- 页面内容 -->
        <Content class="app-content">
          <div class="content-wrapper">
            <RouterView />
          </div>
        </Content>
      </Layout>
    </Layout>

    <!-- Mock Configuration Panel (Development Only) -->
    <MockConfigPanel />
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
  overflow: hidden;
}

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-layout {
  height: 100vh;
}

.app-sider {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
  background: #fff !important;
  z-index: 100;
}

.sider-content {
  height: 100%;
  overflow: hidden;
}

.main-layout {
  background: #f0f2f5;
}

.app-header {
  background: #fff;
  border-bottom: 1px solid #e8e9eb;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0;
  height: 64px;
  z-index: 99;
}

.header-content {
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.trigger-btn {
  font-size: 16px;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  transition: all 0.3s;
}

.trigger-btn:hover {
  background: rgba(0, 0, 0, 0.06);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-title {
  font-size: 20px;
  font-weight: 700;
  color: #1677ff;
  margin: 0;
  line-height: 1;
}

.app-subtitle {
  font-size: 12px;
  color: #999;
  font-weight: 400;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-btn {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s;
}

.toolbar-btn:hover {
  background: rgba(0, 0, 0, 0.06);
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.user-dropdown:hover {
  background: rgba(0, 0, 0, 0.06);
}

.username {
  font-size: 14px;
  color: #262626;
  font-weight: 500;
}

.dropdown-icon {
  font-size: 12px;
  color: #999;
  transition: transform 0.3s;
}

.breadcrumb-container {
  background: #fff;
  border-bottom: 1px solid #e8e9eb;
  padding: 0 24px;
  min-height: 40px;
  display: flex;
  align-items: center;
}

.app-content {
  height: calc(100vh - 64px - 40px);
  overflow: hidden;
  background: #f0f2f5;
}

.content-wrapper {
  height: 100%;
  overflow: auto;
  padding: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }
  
  .logo-section {
    gap: 8px;
  }
  
  .app-title {
    font-size: 18px;
  }
  
  .app-subtitle {
    display: none;
  }
  
  .content-wrapper {
    padding: 16px;
  }
}

/* Ant Design 组件样式覆盖 */
:deep(.ant-layout-sider-trigger) {
  display: none;
}

:deep(.ant-menu-light) {
  background: transparent;
}

:deep(.ant-menu-light .ant-menu-item-selected) {
  background: rgba(22, 119, 255, 0.1);
  border-radius: 6px;
  margin: 4px 8px;
  width: calc(100% - 16px);
}

:deep(.ant-menu-light .ant-menu-item) {
  margin: 4px 8px;
  width: calc(100% - 16px);
  border-radius: 6px;
  transition: all 0.3s;
}

:deep(.ant-menu-light .ant-menu-item:hover) {
  background: rgba(0, 0, 0, 0.06);
}

:deep(.ant-dropdown-menu) {
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

:deep(.ant-dropdown-menu-item) {
  padding: 8px 16px;
  border-radius: 6px;
  margin: 4px;
}
</style>

