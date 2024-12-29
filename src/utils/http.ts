import { fetch, type FetchOptions, Body } from '@tauri-apps/api/http'
import router from '../router'

interface RequestConfig extends FetchOptions {
  baseURL?: string
}

class HttpClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestConfig): Promise<T> {
    try {
      const url = `${this.baseURL}${endpoint}`
      const token = localStorage.getItem('token')

      // 合并默认headers和自定义headers
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      }

      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        switch (response.status) {
          case 401:
            localStorage.removeItem('token')
            router.push('/login')
            break
          case 403:
            router.push('/login')
            break
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.data as T
    } catch (error) {
      console.error('Request failed:', error)
      throw error
    }
  }

  async get<T>(endpoint: string, options: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data: any, options: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: Body.json(data),
    })
  }

  async put<T>(endpoint: string, data: any, options: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: Body.json(data),
    })
  }

  async delete<T>(endpoint: string, options: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

// 创建实例
const http = new HttpClient(import.meta.env.VITE_API_BASE_URL || '')

export default http 