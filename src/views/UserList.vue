<template>
  <div class="user-list">
    <div class="header">
      <h2>用户管理</h2>
      <a-button type="primary" @click="showAddUser">
        添加用户
      </a-button>
    </div>
    
    <a-table :columns="columns" :data-source="users" :loading="loading">
      <template #action="{ record }">
        <a-space>
          <a @click="editUser(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定要删除这个用户吗？"
            @confirm="deleteUser(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
    slots: { customRender: 'action' },
  },
]

const users = ref([
  {
    id: 1,
    username: 'admin',
    createTime: '2024-03-20 10:00:00',
  },
])
const loading = ref(false)

const showAddUser = () => {
  // 实现添加用户逻辑
}

const editUser = (record: any) => {
  // 实现编辑用户逻辑
}

const deleteUser = (id: number) => {
  // 实现删除用户逻辑
}
</script>

<style scoped>
.user-list {
  background-color: white;
  padding: 24px;
  border-radius: 4px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
</style> 