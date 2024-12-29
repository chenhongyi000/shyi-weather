import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import Login from '../views/Login.vue'
import Weather from '../views/Weather.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'Home',
      component: Weather,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/weather',
      name: 'Weather',
      component: Weather,
      meta: { requiresAuth: true }
    }
  ]
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // 如果需要认证且没有 token
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } 
  // 如果已经有 token 且要去登录页
  else if (token && to.path === '/login') {
    next('/home')
  }
  else {
    next()
  }
})

export default router 