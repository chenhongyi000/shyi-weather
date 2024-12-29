import { createApp } from "vue";
import App from "./App.vue";
import 'ant-design-vue/dist/reset.css';
// 引入和风天气图标
import 'qweather-icons/font/qweather-icons.css'
import { Button } from 'ant-design-vue';
import router from './router'

const app = createApp(App)
app.use(Button);
app.use(router)
app.mount("#app");
