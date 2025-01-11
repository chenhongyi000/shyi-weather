import axios from 'axios'
import router from '../router'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    
    // 如果有 token 则添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    // 确保请求头包含正确的 Content-Type
    if (config.method === 'post') {
      config.headers['Content-Type'] = 'application/json'
    }
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401: // token 过期或无效
          localStorage.removeItem('token')
          router.push('/login')
          break
        case 403: // 权限不足
          router.push('/login')
          break
        case 405: // 方法不允许
          console.error('请求方法不被允许，请检查请求方法是否正确')
          break
        default:
          console.error('请求错误：', error.response.data)
      }
    }
    return Promise.reject(error)
  }
)

export default request 