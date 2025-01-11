import { fetch } from '@tauri-apps/plugin-http'

// 定义响应接口
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 天气数据接口
interface WeatherData {
  temp: string
  text: string
  windDir: string
  windScale: string
  humidity: string
}

export const weatherApi = {
  // 获取实时天气
  async getNowWeather(location: string): Promise<ApiResponse<WeatherData>> {
    try {
      const response = await fetch(
        'https://devapi.qweather.com/v7/weather/now', 
        {
          method: 'GET',
          query: {
            location,
            key: 'your-api-key' // 替换成你的和风天气 API key
          },
          responseType: ResponseType.JSON
        }
      )
      
      if (response.ok) {
        const data = response.data as any
        return {
          code: 200,
          message: 'success',
          data: {
            temp: data.now.temp,
            text: data.now.text,
            windDir: data.now.windDir,
            windScale: data.now.windScale,
            humidity: data.now.humidity
          }
        }
      } else {
        throw new Error(`请求失败: ${response.status}`)
      }
    } catch (error) {
      console.error('获取天气失败:', error)
      throw error
    }
  },

  // 发送 POST 请求示例
  async login(username: string, password: string): Promise<ApiResponse<{ token: string }>> {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      })

      if (response.ok) {
        return response.data as ApiResponse<{ token: string }>
      } else {
        throw new Error(`登录失败: ${response.status}`)
      }
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }
} 