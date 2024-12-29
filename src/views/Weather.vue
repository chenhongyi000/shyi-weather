<template>
  <app class="container">
    <div class="login-btn-container">
      <button @click="goToLogin" class="login-btn">登录</button>
    </div>
    <div class="city-weather">
      <div style="color: #fff;background-image: linear-gradient(225deg, #2A427F, #1B2751);border-radius: 16px;padding: 10px;">
        <div><p style="text-align: right;">{{ weatherInfo.updateTime }}</p></div>
        <div style="display: flex;justify-content: center;align-items: center;">
          <div><i :class="`qi-${weatherInfo.now.icon } weather-img`"></i></div>
          <div style="display: flex;flex-direction: column;justify-content: center;margin-left: 10px;">
            <div style="font-size: 52px;text-align: left;">{{ weatherInfo.now.temp }}°</div>
            <div style="text-align: left;">{{ weatherInfo.now.text }}</div></div>
        </div>
        <div>
          <ul class="weather-attr-wrap">
            <li>
              <div>{{ weatherInfo.now.windScale }}级</div>
              <div>{{ weatherInfo.now.windDir }}</div>
            </li>
            <li>
              <div>{{ weatherInfo.now.humidity }}%</div>
              <div>相对湿度</div>
            </li>
            <!-- <li>
              <div>{{ weatherInfo.now.humidity }}%</div>
              <div>紫外线</div>
            </li> -->
            <li>
              <div>{{ weatherInfo.now.feelsLike }}°</div>
              <div>体感温度</div>
            </li>
            <li>
              <div>{{ weatherInfo.now.vis }}km</div>
              <div>能见度</div>
            </li>
            <li>
              <div>{{ weatherInfo.now.precip }}mm</div>
              <div>降水量</div>
            </li>
            <li>
              <div>{{ weatherInfo.now.pressure }}hPa</div>
              <div>大气压</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
</app>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from 'vue-router';
const router = useRouter();
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
const goToLogin = () => {
  router.push('/login');
}
</script>

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