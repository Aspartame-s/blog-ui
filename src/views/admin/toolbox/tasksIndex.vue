<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import request from '@/api/request'
import { ElMessage } from 'element-plus'
import { Download, WarningFilled } from '@element-plus/icons-vue'

const tasks = ref<any[]>([])
const loading = ref(true)
let evtSource: EventSource | null = null

// 拉取历史存量工单大盘
const fetchTasks = async () => {
    loading.value = true
    try {
        const res = await request.get('/toolbox/tasks')
        tasks.value = res.data
    } catch (e) {
        ElMessage.error('无法连线底层的工单控制器接口')
    } finally {
        loading.value = false
    }
}

// 建立黑客级 SSE 流心跳网线
const setupSSE = () => {
    // 动态提取环境中的基建 API 域名头
    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    
    // 打开浏览器纯血原生 EventSource 双工单向流口
    evtSource = new EventSource(`${serverUrl}/toolbox/stream`)
    
    evtSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            if (data.type === 'connected') {
                console.log('%c🚀 [System] 已成功监听后端 Node.js SSE 心跳广播通道！', 'color: #00d4ff; font-weight: bold')
                return
            }
            
            // 数据下发，即时追踪对应的本地大盘工单坐标
            const taskIndex = tasks.value.findIndex(t => t.id === data.id)
            if (taskIndex !== -1) {
                // 如果表里有：全息数据覆盖
                tasks.value[taskIndex].progress = data.progress
                tasks.value[taskIndex].status = data.status
                if (data.errorMsg) tasks.value[taskIndex].error_msg = data.errorMsg
            } else {
                // 表里没有：代表这是一条全新上传发配的工单流！触发强制大盘拉取
                fetchTasks()
            }
        } catch (err) {
            console.warn('忽略了一条无法破译的弱 SSE 流噪帧', err)
        }
    }

    evtSource.onerror = (err) => {
        console.error('SSE 流传输线路意外中断，底层守护自动重联中...', err)
    }
}

// 生命周期函数挂起与拆卸
onMounted(() => {
    fetchTasks()
    setupSSE()
})

onUnmounted(() => {
    if (evtSource) {
        console.log('用户退出工单中心，优雅剪断 SSE 链接...')
        evtSource.close()
    }
})

// UI 胶水辅助体系
const getStatusType = (status: string) => {
    if (status === 'done') return 'success'
    if (status === 'failed') return 'danger'
    if (status === 'processing') return 'warning'
    return 'info'
}

// 采用浏览器传统窗口脱机下载保障兼容性
const downloadFile = (taskId: number) => {
    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    window.open(`${serverUrl}/toolbox/download/${taskId}`, '_blank')
}
</script>

<template>
  <div class="tasks-container p-6 bg-default rounded-xl shadow-lg border border-color">
    <div class="mb-8 flex justify-between items-end">
      <div>
        <div class="flex items-center space-x-3">
            <h2 class="text-[28px] font-black text-gray-800 dark:text-gray-200 tracking-tight">我的任务雷达大厅</h2>
            <div class="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded ring-1 ring-teal-500/20 shadow-sm animate-pulse">
                • 实时流连接活跃
            </div>
        </div>
        <p class="text-gray-500 mt-2 font-medium">全局离线转换池 · 采用低消耗 Server-Sent Events 单线程毫秒级进度流广播</p>
      </div>
      <el-button type="primary" plain @click="fetchTasks" :loading="loading">拉取镜像数据</el-button>
    </div>

    <!-- 数据全息大盘 -->
    <el-table 
       :data="tasks" 
       v-loading="loading" 
       style="width: 100%" 
       class="shadow-sm rounded-lg overflow-hidden border border-color" 
       :header-cell-style="{background:'var(--el-color-primary-light-9)', color:'var(--el-text-color-primary)'}">
       
      <el-table-column prop="id" label="队列坐标" width="100" align="center">
          <template #default="{ row }">
             <span class="font-mono text-gray-500">#{{ String(row.id).padStart(4, '0') }}</span>
          </template>
      </el-table-column>
      
      <el-table-column prop="task_name" label="工单载荷目标" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">
              <span class="font-bold tracking-tight">{{ row.task_name }}</span>
          </template>
      </el-table-column>
      
      <el-table-column label="子算力类型" width="140" align="center">
        <template #default="{ row }">
          <el-tag type="info" hit v-if="row.task_type === 'pdf2word'" class="border-blue-200 bg-blue-50 text-blue-600">PDF 析至 Word</el-tag>
          <el-tag type="primary" hit v-else>{{ row.task_type }}</el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="执行器底层进度条" min-width="320">
        <template #default="{ row }">
          <div class="flex items-center space-x-3 w-full pr-4 relative group">
            <el-progress 
                :percentage="row.progress || 0" 
                :status="getStatusType(row.status)"
                :stroke-width="14"
                :show-text="false"
                class="flex-1 drop-shadow-sm"
                :class="{'animate-pulse opacity-90': row.status === 'processing'}"
            />
            <div class="absolute -top-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gray-400 font-mono" v-if="row.status === 'processing'">
                [SSE Packet Transferring...]
            </div>
            <span class="text-sm font-black w-[50px] text-right tracking-tighter shrink-0 drop-shadow-sm" 
                  :class="{
                     'text-blue-500': row.status === 'processing',
                     'text-emerald-500': row.status === 'done',
                     'text-rose-500': row.status === 'failed'
                  }">
                {{ row.progress || 0 }}%
            </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="调度网状态" width="160" align="center">
        <template #default="{ row }">
            <el-tag type="warning" effect="dark" v-if="row.status === 'processing'" class="shadow-sm">
                算力激增运行中...
            </el-tag>
            <el-tag type="success" effect="dark" v-else-if="row.status === 'done'" class="shadow-sm">
                系统全息脱机
            </el-tag>
            <el-tag type="danger" effect="dark" v-else-if="row.status === 'failed'" class="shadow-sm">
                致命解析崩落
            </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="云端萃取介质传输" width="160" align="center" fixed="right">
        <template #default="{ row }">
            <el-button v-if="row.status === 'done'" class="shadow-sm hover:shadow-md transition-shadow" type="success" :icon="Download" round size="small" @click="downloadFile(row.id)">提取回执</el-button>
            <el-tooltip v-else-if="row.status === 'failed'" :content="row.error_msg" placement="left-start">
                <el-button type="danger" :icon="WarningFilled" plain text size="small">检阅致命错误源</el-button>
            </el-tooltip>
            <span v-else class="text-gray-400 text-xs font-mono tracking-widest animate-pulse flex items-center justify-center space-x-1">
                <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
            </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.tasks-container {
  min-height: calc(100vh - 120px);
}
</style>
