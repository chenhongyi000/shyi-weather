<template>
  <div class="weather-container">
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="weather-info">
      <h2>{{ weather }}</h2>
      <!-- <div class="weather-details">
        <p>温度：{{ weather.temp }}°C</p>
        <p>风向：{{ weather.windDir }}</p>
        <p>风力：{{ weather.windScale }}级</p>
        <p>湿度：{{ weather.humidity }}%</p>
      </div> -->
    </div>
    <button @click="refreshWeather">刷新天气</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { weatherApi } from '../utils/api'

const weather = ref<any>(null)
const loading = ref(false)
const error = ref('')

const getWeather = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await weatherApi.getNowWeather('101010100') // 北京的城市编码
    weather.value = response.data
  } catch (e) {
    error.value = '获取天气信息失败'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const refreshWeather = () => {
  getWeather()
}

onMounted(() => {
  getWeather()
})
</script>

<style scoped>
/* .weather-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.weather-info {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  background-color: #4A5FBF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3A4FA0;
} */
</style>