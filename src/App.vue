<script setup lang="ts">
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";
import axios from "axios";
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
  console.log(router)
  router.push('/login');
};

const greetMsg = ref("");
const name = ref("");
const weatherAttrList = [{
  
}]
async function greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  greetMsg.value = await invoke("greet", { name: name.value });
}
const weatherInfo = ref(
  {
  "code": "200",
  "updateTime": "2020-06-30T22:00+08:00",
  "fxLink": "http://hfx.link/2ax1",
  "now": {
    "obsTime": "2020-06-30T21:40+08:00",
    "temp": "24",
    "feelsLike": "26",
    "icon": "101",
    "text": "多云",
    "wind360": "123",
    "windDir": "东南风",
    "windScale": "1",
    "windSpeed": "3",
    "humidity": "72",
    "precip": "0.0",
    "pressure": "1003",
    "vis": "16",
    "cloud": "10",
    "dew": "21"
  },
  "refer": {
    "sources": [
      "QWeather",
      "NMC",
      "ECMWF"
    ],
    "license": [
      "QWeather Developers License"
    ]
  }
})
const getWeather = async () => {
  // axios({
  //   method: 'get',
  //   url: "https://devapi.qweather.com/v7/weather/now?location=101010100",
  //   headers: {
  //     "X-QW-Api-Key": "b05f6318789c472d9c31e7afe7d83ae3"
  //   }
  // }).then((res) => {
  //   console.log(res);
  // })

}
</script>

<template>
  <router-view></router-view>
</template>
<style>
body {
  background-color: #202124;
}
</style>
<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}

.login-btn-container {
  position: absolute;
  top: 20px;
  right: 20px;
}

.login-btn {
  padding: 8px 16px;
  background-color: #4A5FBF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-btn:hover {
  background-color: #3A4FA0;
}
</style>
<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin: 0 10px;
}
.weather-attr-wrap {
  display: flex;
  justify-content: space-around;
  li {
    list-style: none;
  }
  background-color: rgba(160, 166, 180, 0.1);
  margin: 10px;
  border-radius: 12px;
}
.weather-img {
  font-size: 78px;
}
</style>