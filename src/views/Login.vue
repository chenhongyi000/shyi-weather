<template>
  <div class="login-container">
    <h2>登录</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-item">
        <input type="text" v-model="username" placeholder="用户名">
      </div>
      <div class="form-item">
        <input type="password" v-model="password" placeholder="密码">
      </div>
      <button type="submit">登录</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import http from '../utils/http'
import { fetch } from '@tauri-apps/plugin-http'
const router = useRouter()
const username = ref('')
const password = ref('')

interface LoginResponse {
  token: string
  // 其他返回字段...
}

const handleLogin = async () => {
  try {
    const data = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })
    
    if (data.token) {
      localStorage.setItem('token', data.token)
      router.push('/weather')
    } else {
      throw new Error('登录失败：未收到token')
    }
  } catch (error) {
    console.error('登录失败：', error)
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #1B2751;
  color: white;
}

.form-item {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #2A427F;
  color: white;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4A5FBF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3A4FA0;
}
</style> 