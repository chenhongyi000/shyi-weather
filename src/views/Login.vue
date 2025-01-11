<template>
  <div class="login-container">
    <div class="login-card">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-item">
          <input 
            type="text" 
            v-model="username" 
            placeholder="用户名"
            autocomplete="username"
          >
        </div>
        <div class="form-item">
          <input 
            type="password" 
            v-model="password" 
            placeholder="密码"
            autocomplete="current-password"
          >
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <button type="submit" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CryptoJS from 'crypto-js'
import { fetch } from '@tauri-apps/plugin-http'
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'
import { getCurrentWebview } from '@tauri-apps/api/webview'
import { PhysicalSize } from '@tauri-apps/api/dpi';
import { appWindow } from '@tauri-apps/api/window'
const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const ENCRYPT_KEY = 'your-secret-key-123'

const handleLogin = async (type: string) => {
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码'
    return
  }
  try {
    loading.value = true
    error.value = ''
    
    const encryptedPassword = CryptoJS.AES.encrypt(password.value, ENCRYPT_KEY).toString()
    
    const response = await fetch('http://106.14.182.253:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // 允许发送 cookies
      body: JSON.stringify({ username: username.value, password: encryptedPassword })
    })
    
    const data = await response.json()
    if (data.code === 200) {
      localStorage.setItem('token', data.data.token)
      
      // 获取当前窗口
      const currentWindow = WebviewWindow.getByLabel('login')
      // console.log(currentWindow)
      // await appWindow.setResizable(true); 
      // 调整窗口大小和位置
      // await currentWindow?.setSize(new PhysicalSize(1200, 800))
      // await currentWindow?.center()
      
      // 跳转到主页
      router.push('/main')
    } else {
      error.value = '登录失败：' + data.message
    }
  } catch (e) {
    error.value = '登录失败，请稍后重试'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.gradient-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  position: absolute;
  top: 0;
  left: 0;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.login-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  width: 100%;
  max-width: 400px;
  z-index: 1;
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.form-item {
  margin-bottom: 1.5rem;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #23a6d5;
  box-shadow: 0 0 0 3px rgba(35, 166, 213, 0.1);
}

button {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(45deg, #23a6d5, #23d5ab);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover:not(:disabled) {
  background: linear-gradient(45deg, #1f95c0, #1fb893);
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #e73c7e;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

/* Neo-morphism effects */
.login-card {
  border: 1px solid rgba(255, 255, 255, 0.2);
}

input {
  box-shadow: 
    inset 2px 2px 5px rgba(0, 0, 0, 0.05),
    inset -2px -2px 5px rgba(255, 255, 255, 0.5);
}

button {
  box-shadow: 
    5px 5px 10px rgba(0, 0, 0, 0.1),
    -5px -5px 10px rgba(255, 255, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style> 