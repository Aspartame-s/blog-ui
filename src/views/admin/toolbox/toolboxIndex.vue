<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import request from '@/api/request'

const router = useRouter()
const pdfInput = ref<HTMLInputElement | null>(null)

const triggerPdfUpload = () => {
  pdfInput.value?.click()
}

const handlePdfUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.type !== 'application/pdf') {
    ElMessage.error('类型校验失败：请必须选择 .pdf 后缀的文件！')
    target.value = ''
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  const loading = ElLoading.service({
    lock: true,
    text: '高维封装：正在将物理文件打包上传至云端服务器控制队列，请稍候...',
    background: 'rgba(0, 0, 0, 0.85)'
  })

  try {
    // 覆盖全局 request.ts 的 5 秒超时。大文件在弱网环境下上传极其容易超过 5 秒。
    const res = await request.post('/toolbox/pdf-to-word', formData, {
      timeout: 0 // 对于文件上传，设置无限时等待其流传输完毕
    })
    
    loading.close()
    // 此处为新版 JSON API
    if (res.code === 200) {
        ElMessage.success('🔥 文件已被云端底座成功托管，转移视线，接驳全局监听大盘...')
        setTimeout(() => {
            router.push('/admin/toolbox/tasks') // 瞬间跳转到全新 SSE 网线的页面查看进度飙升
        }, 600)
    } else {
        ElMessage.error(res.message || '调度建立异常，网关拒绝托管')
    }
  } catch (error: any) {
    loading.close()
    ElMessage.error(error.message || '服务器物理级连接中断，请检查基建网络')
  } finally {
    target.value = '' 
  }
}

const handleWordToPdf = () => {
  ElMessage.info('正在连线底层 LibreOffice 引擎，该功能即将上线，敬请期待！')
}
</script>

<template>
  <div class="toolbox-container">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">工具箱</h2>
      <p class="text-gray-500 mt-2">基于高性能底层环境提供的专业级文档处理小管家。</p>
    </div>

    <!-- 极简风格：利用隐藏的 input 节点替代臃肿的上传控件 -->
    <input type="file" ref="pdfInput" accept="application/pdf" class="hidden" @change="handlePdfUpload" />

    <el-row :gutter="24">
      <!-- PDF 转 Word -->
      <el-col :xs="24" :sm="12" :md="8" class="mb-4">
        <el-card shadow="hover" class="h-full cursor-pointer group transition-all hover:scale-[1.02]" @click="triggerPdfUpload">
          <div class="flex flex-col items-center justify-center p-6 text-center">
            <div class="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <span class="material-symbols-outlined text-4xl text-blue-500">picture_as_pdf</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">PDF 高保真转 Word</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              通过底层算法完美保留您的段落、内联表格及嵌入式图片，并输出为标准 .docx 格式。
            </p>
          </div>
        </el-card>
      </el-col>

      <!-- Word 转 PDF -->
      <el-col :xs="24" :sm="12" :md="8" class="mb-4">
        <el-card shadow="hover" class="h-full cursor-pointer group transition-all opacity-80 hover:opacity-100" @click="handleWordToPdf">
          <div class="flex flex-col items-center justify-center p-6 text-center">
            <div class="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
              <span class="material-symbols-outlined text-4xl text-indigo-500">description</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Word 无极转 PDF</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              采用企业级无头 LibreOffice 服务器引擎引擎进行矢量级完美呈现渲染。（即将开放）
            </p>
          </div>
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
