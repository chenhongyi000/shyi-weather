<template>
  <div class="settings">
    <h2>系统设置</h2>
    <a-form :model="formState" layout="vertical">
      <a-form-item label="主题">
        <a-select v-model:value="formState.theme">
          <a-select-option value="light">浅色</a-select-option>
          <a-select-option value="dark">深色</a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item label="语言">
        <a-select v-model:value="formState.language">
          <a-select-option value="zh">中文</a-select-option>
          <a-select-option value="en">English</a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item>
        <a-button type="primary" @click="saveSettings">
          保存设置
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const formState = reactive({
  theme: 'light',
  language: 'zh'
})

const saveSettings = () => {
  // 实现保存设置的逻辑
  console.log('保存设置:', formState)
}
</script>

<style scoped>
.settings {
  background-color: white;
  padding: 24px;
  border-radius: 4px;
}
</style> 