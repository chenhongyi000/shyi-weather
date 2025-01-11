import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import {
  UserOutlined,
  CloudOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'
import Login from '@/views/Login.vue'
import Main from '@/views/Main.vue'
import Layout from '@/components/Layout/index.vue'
// 扩展 RouteRecordRaw 类型，添加菜单相关字段
interface MenuRoute extends RouteRecordRaw {
  meta?: {
    title?: string
    icon?: any
    hideInMenu?: boolean
  }
}

const routes: MenuRoute[] = [
  {
    path: '/',
    redirect: '/login',
    meta: {
      hideInMenu: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      hideInMenu: true
    }
  },
  {
    path: '/main',
    name: 'Main',
    component: Layout,
    redirect: '/main/users',
    children: [
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/UserList.vue'),
        meta: {
          title: '用户管理',
          icon: UserOutlined
        }
      },
      {
        path: 'weather',
        name: 'Weather',
        component: () => import('@/views/Weather.vue'),
        meta: {
          title: '天气预报',
          icon: CloudOutlined
        }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue'),
        meta: {
          title: '系统设置',
          icon: SettingOutlined
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router 