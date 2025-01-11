<template>
  <div class="kanban-record">
    <div class="record-form">
      <h2>看板记录</h2>
      <a-form layout="vertical">
        <a-form-item label="看板号">
          <a-input
            v-model:value="kanbanNo"
            placeholder="请输入看板号"
            @keyup.enter="handleRecord"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" :loading="loading" @click="handleRecord">
            记录
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <div class="record-list">
      <h3>记录列表</h3>
      <a-table :columns="columns" :data-source="records" :loading="tableLoading">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'recordTime'">
            {{ formatDate(record.recordTime) }}
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { fetch } from '@tauri-apps/api/http'
import dayjs from 'dayjs'

const kanbanNo = ref('')
const loading = ref(false)
const tableLoading = ref(false)
const records = ref([])

const columns = [
  {
    title: '看板号',
    dataIndex: 'kanbanNo',
    key: 'kanbanNo',
  },
  {
    title: '记录时间',
    dataIndex: 'recordTime',
    key: 'recordTime',
  }
]

// 记录看板
const handleRecord = async () => {
  if (!kanbanNo.value) {
    message.warning('请输入看板号')
    return
  }

  try {
    loading.value = true
    const response = await fetch('http://localhost:3000/kanban/record', {
      method: 'POST',
      body: {
        type: 'Json',
        payload: {
          kanbanNo: kanbanNo.value
        }
      }
    })

    if (response.status === 200) {
      message.success('记录成功')
      kanbanNo.value = ''
      getRecords()
    }
  } catch (error) {
    console.error('记录失败:', error)
    message.error('记录失败')
  } finally {
    loading.value = false
  }
}

// 获取记录列表
const getRecords = async () => {
  try {
    tableLoading.value = true
    const response = await fetch('http://localhost:3000/kanban/records')
    
    if (response.status === 200) {
      records.value = (response.data as any).data
    }
  } catch (error) {
    console.error('获取记录失败:', error)
    message.error('获取记录失败')
  } finally {
    tableLoading.value = false
  }
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  getRecords()
})
</script>

<style scoped>
.kanban-record {
  padding: 24px;
  background: white;
  border-radius: 8px;
}

.record-form {
  max-width: 400px;
  margin-bottom: 32px;
}

.record-list {
  margin-top: 24px;
}
</style> 