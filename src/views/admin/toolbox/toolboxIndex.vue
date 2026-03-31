<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import request from '@/api/request'

const router = useRouter()
const pdfInput = ref<HTMLInputElement | null>(null)
const pptInput = ref<HTMLInputElement | null>(null) // 新增 PPT 触发锚点

// 触发原本极其沉重的排版拆解 PDF 转换任务
const triggerPdfUpload = () => {
    pdfInput.value?.click()
}

// 触发全新研发的极速相册降维 PPT 组装任务
const triggerPptUpload = () => {
    pptInput.value?.click()
}

const handlePdfUpload = async (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
        ElMessage.error('类型校验失败：请确保源文件隶属 PDF 大类！')
        target.value = ''
        return
    }

    const formData = new FormData()
    formData.append('file', file)

    const loading = ElLoading.service({
        lock: true,
        text: '高维封装：正在将排版解析包上传至云端服务器控制队列...',
        background: 'rgba(0, 0, 0, 0.85)'
    })

    try {
        const res = await request.post('/toolbox/pdf-to-word', formData, { timeout: 0 })
        loading.close()
        if (res.code === 200) {
            ElMessage.success('🔥 排版解析任务池已纳管该请求，前往大盘监视队列...')
            setTimeout(() => { router.push('/admin/toolbox/tasks') }, 600)
        } else {
            ElMessage.error(res.message || '调度建立异常')
        }
    } catch (error: any) {
        loading.close()
        ElMessage.error(error.message || '服务器物理层连接断裂...')
    } finally {
        target.value = ''
    }
}

// 基于高度解耦特性的全新图集 PPTX 数据源钩子
const handlePptUpload = async (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
        ElMessage.error('该引擎强制绑定 PDF 数据包，请重选文件！')
        target.value = ''
        return
    }

    const formData = new FormData()
    formData.append('file', file)

    const loading = ElLoading.service({
        lock: true,
        text: '图层矩阵拆解：正在将渲染快照指令同步至极速调度网...',
        background: 'rgba(0, 0, 0, 0.85)'
    })

    try {
        // 无限超时支持上传巨型文档
        const res = await request.post('/toolbox/pdf-to-ppt', formData, { timeout: 0 })
        loading.close()
        if (res.code === 200) {
            ElMessage.success('🌟 物理快照截取矩阵成功响应，即将跳入总工单监控仓...')
            setTimeout(() => { router.push('/admin/toolbox/tasks') }, 600)
        } else {
            ElMessage.error(res.message || '引擎挂载拒绝访问')
        }
    } catch (error: any) {
        loading.close()
        ElMessage.error(error.message || '网关通信熔断...')
    } finally {
        target.value = ''
    }
}

const handleWordToPdf = () => {
    ElMessage.info('底层 LibreOffice 渲染核心即将入驻该卡槽，敬请期待！')
}
</script>

<template>
  <div class="toolbox-container p-4 bg-default rounded-xl shadow-sm border border-color">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">全栈工业化工具厅</h2>
      <p class="text-gray-500 mt-2">依靠私有物理算力强拆格式的高维数据车间。</p>
    </div>

    <!-- 隐藏的基础唤醒锚点钩子 -->
    <input type="file" ref="pdfInput" @change="handlePdfUpload" accept=".pdf" class="hidden" />
    <input type="file" ref="pptInput" @change="handlePptUpload" accept=".pdf" class="hidden" />

    <el-row :gutter="20">
      <!-- Card 1: 暴力排版破解 Word -->
      <el-col :span="8" :xs="24" :sm="12" class="mb-4">
        <el-card shadow="hover" class="h-full flex flex-col justify-center text-center cursor-pointer hover:shadow-lg transition-shadow group" @click="triggerPdfUpload">
          <div class="mb-4 transform transition-transform group-hover:scale-110">
            <span class="material-symbols-outlined text-[48px] text-blue-500 bg-blue-50 p-4 rounded-full">plagiarism</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">排版级：PDF 碎拆入 Word</h3>
          <p class="text-sm text-gray-500">
            算力黑洞级解析。基于几何矩阵复推其内部被封存在框架中的隐藏物理表格及矢量文本段。
          </p>
        </el-card>
      </el-col>

      <!-- Card 2: 降维物理快照化 PPT -->
      <el-col :span="8" :xs="24" :sm="12" class="mb-4">
        <el-card shadow="hover" class="h-full flex flex-col justify-center text-center cursor-pointer hover:shadow-lg transition-shadow group border-teal-200" @click="triggerPptUpload">
          <div class="mb-4 transform transition-transform group-hover:scale-110">
            <span class="material-symbols-outlined text-[48px] text-teal-600 bg-teal-50 p-4 rounded-full ring-2 ring-teal-100 ring-offset-2">slideshow</span>
          </div>
          <h3 class="text-lg font-semibold text-teal-700 dark:text-teal-400 mb-2">降频级：PDF 速绘至 PPT</h3>
          <p class="text-sm text-gray-500">
            丢弃脆弱且烧脑的底层推演，直接用纯位图降频方式拍出 100% 毫无走边之危的长卷幻灯画册。
          </p>
        </el-card>
      </el-col>

      <!-- Card 3: 尚未竣工的 LibreOffice 阵列 -->
      <el-col :span="8" :xs="24" :sm="12" class="mb-4">
        <el-card shadow="hover" class="h-full flex flex-col justify-center text-center cursor-pointer group bg-gray-50 dark:bg-gray-800 opacity-60" @click="handleWordToPdf">
          <div class="mb-4">
            <span class="material-symbols-outlined text-[48px] text-gray-400 bg-gray-100 p-4 rounded-full">print_connect</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">Word 企业化强染至 PDF</h3>
          <p class="text-sm text-gray-400">
            挂载于开源 LibreOffice 的无头服务器引擎进行排版的绝对封存。(引擎冷却接入中)
          </p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.toolbox-container {
  min-height: calc(100vh - 120px);
}
.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48;
}
.hidden {
  display: none;
}
</style>
