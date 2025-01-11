<template>
  <div class="titlebar">
    <div class="titlebar-drag" data-tauri-drag-region>
      <div class="title">{{ title }}</div>
    </div>
    <div class="window-controls">
      <button class="minimize" @click="minimize">
        <span>─</span>
      </button>
      <button class="maximize" @click="toggleMaximize">
        <span>□</span>
      </button>
      <button class="close" @click="close">
        <span>×</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentWindow } from '@tauri-apps/api/window'
import { ref } from 'vue'

const props = defineProps<{
  title?: string
}>()

const isMaximized = ref(false)

const minimize = async () => {
  const window = getCurrentWindow()
  await window.minimize()
}

const toggleMaximize = async () => {
  const window = getCurrentWindow()
  isMaximized.value = !isMaximized.value
  if (isMaximized.value) {
    await window.maximize()
  } else {
    await window.unmaximize()
  }
}

const close = async () => {
  const window = getCurrentWindow()
  await window.close()
}
</script>

<style scoped>
.titlebar {
  height: 30px;
  background: #1B2751;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  color: white;
  user-select: none;
}

.titlebar-drag {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 8px;
}

.window-controls {
  display: flex;
  gap: 8px;
}

.window-controls button {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.window-controls button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.close:hover {
  background-color: #e81123 !important;
}

.title {
  font-size: 12px;
}
</style> 