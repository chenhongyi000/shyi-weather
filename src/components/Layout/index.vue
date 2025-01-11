<template>
  <div class="layout" :class="{ 'mobile': isMobile }">
    <!-- 左侧/底部菜单 -->
    <div class="sidebar" :class="{ 'mobile': isMobile }">
      <div class="logo" v-if="!isMobile">
        <h2>管理系统</h2>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKey"
        :mode="isMobile ? 'horizontal' : 'inline'"
        theme="dark"
      >
        <a-menu-item 
          v-for="menu in menus" 
          :key="menu.path"
          @click="navigateTo(menu.path)"
        >
          <template #icon>
            <component :is="menu.meta?.icon" />
          </template>
          <span v-if="!isMobile">{{ menu.meta?.title }}</span>
        </a-menu-item>
      </a-menu>
    </div>

    <!-- 中间内容区 -->
    <div class="main" :class="{ 'mobile': isMobile }">
      <div class="header">
        <div class="breadcrumb">
          <a-breadcrumb>
            <a-breadcrumb-item>首页</a-breadcrumb-item>
            <a-breadcrumb-item>{{ currentRoute?.meta?.title }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="user-info">
          <a-dropdown>
            <a class="user-dropdown">
              {{ username }}
              <down-outlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="handleLogout">
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div class="content">
        <router-view v-slot="{ Component , route }">
          <component :is="Component" :key="route.path"></component>
        </router-view>
      </div>
    </div>

    <!-- 右侧对话框 - 在移动端作为可切换的抽屉 -->
    <div class="chat-panel" :class="{ 'mobile': isMobile, 'active': showChat }">
      <template v-if="isMobile">
        <a-button 
          class="chat-toggle"
          type="primary"
          shape="circle"
          @click="toggleChat"
        >
          <template #icon>
            <message-outlined />
          </template>
        </a-button>
      </template>
      <div class="chat-content" v-show="!isMobile || showChat">
        <div class="chat-header">
          <h3>消息中心</h3>
          <close-outlined v-if="isMobile" @click="toggleChat" />
        </div>
        <div class="chat-messages">
          <div v-for="msg in messages" :key="msg.id" class="message">
            <div class="message-content">{{ msg.content }}</div>
            <div class="message-time">{{ msg.time }}</div>
          </div>
        </div>
        <div class="chat-input">
          <a-textarea
            v-model:value="messageInput"
            placeholder="输入消息..."
            :rows="3"
          />
          <a-button type="primary" @click="sendMessage">发送</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  DownOutlined,
  MessageOutlined,
  CloseOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const username = ref(localStorage.getItem('username') || '用户')
const messageInput = ref('')
const messages = ref([
  { id: 1, content: '欢迎使用系统', time: '10:00' }
])
const isMobile = ref(false)
const showChat = ref(false)

// 检查是否为移动设备
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// 监听窗口大小变化
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// 切换聊天面板
const toggleChat = () => {
  showChat.value = !showChat.value
}

// 从路由配置中获取菜单
const menus = computed(() => {
  const mainRoute = router.options.routes.find(route => route.path === '/main')
  return mainRoute?.children?.filter(route => !route.meta?.hideInMenu) || []
})

// 当前选中的菜单项
const selectedKey = computed(() => [route.path])

// 当前路由信息
const currentRoute = computed(() => {
  return route.matched[route.matched.length - 1]
})

// 导航方法
const navigateTo = (path: string) => {
  router.push(path)
  if (isMobile.value && showChat.value) {
    showChat.value = false
  }
}

// 发送消息
const sendMessage = () => {
  if (!messageInput.value.trim()) return
  
  messages.value.push({
    id: Date.now(),
    content: messageInput.value,
    time: new Date().toLocaleTimeString()
  })
  messageInput.value = ''
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  router.push('/login')
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
}

.layout.mobile {
  flex-direction: column;
}

.sidebar {
  width: 200px;
  background-color: #001529;
  color: white;
  transition: all 0.3s ease;
}

.sidebar.mobile {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
}

.logo {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #002140;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main.mobile {
  margin-bottom: 50px; /* 为底部菜单留出空间 */
}

.header {
  height: 64px;
  padding: 0 24px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.chat-panel {
  width: 300px;
  background-color: white;
  border-left: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.chat-panel.mobile {
  position: fixed;
  right: 16px;
  bottom: 70px;
  width: auto;
  border: none;
}

.chat-panel.mobile .chat-content {
  position: fixed;
  right: 16px;
  bottom: 70px;
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  max-height: 60vh;
}

.chat-toggle {
  width: 48px;
  height: 48px;
}

.chat-header {
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.message {
  margin-bottom: 16px;
  padding: 8px;
  background-color: #f0f2f5;
  border-radius: 4px;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.chat-input {
  padding: 16px;
  border-top: 1px solid #e8e8e8;
}

.chat-input :deep(.ant-input) {
  margin-bottom: 8px;
}

/* 移动端菜单样式 */
:deep(.ant-menu-horizontal) {
  line-height: 50px;
  display: flex;
  justify-content: space-around;
}

:deep(.ant-menu-horizontal > .ant-menu-item) {
  margin: 0;
  flex: 1;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .header {
    padding: 0 12px;
  }
  
  .content {
    padding: 12px;
  }
  
  .breadcrumb {
    display: none;
  }
}
</style> 