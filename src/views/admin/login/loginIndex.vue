<!-- /Users/chengjiahui/blog/blog-ui/src/views/admin/login/loginIndex.vue -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import request from '@/api/request'
import { useTheme } from '@/utils/useTheme' // <--- 1. 引入 useTheme
useTheme() // <--- 2. 调用它来初始化主题

const router = useRouter()
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  loading.value = true
  try {
    const res = await request.post('/login', form)
    localStorage.setItem('blog-token', res.data.token)
    ElMessage.success('登录成功')
    router.push('/admin')
  } catch (error) {
    console.error('登录请求失败', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
    <div class="absolute inset-0 bg-black opacity-30"></div>
    
    <el-card class="w-full max-w-md !rounded-xl shadow-2xl relative z-10 glass-card">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold  mb-2">欢迎回来</h1>
        <p class="text-gray-500 dark:text-gray-400">登录博客后台管理系统</p>
      </div>

      <el-form :model="form" size="large" @submit.prevent="handleLogin">
        <el-form-item>
          <el-input 
            v-model="form.username" 
            placeholder="用户名" 
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item>
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="密码" 
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            class="w-full !rounded-lg" 
            :loading="loading"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-bg {
  background-image: url('https://picsum.photos/1920/1080?blur=2');
  background-size: cover;
  background-position: center;
}

/* 浅色模式样式 */
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: none;
  transition: background .3s ease, border .3s ease;
}

/* 深色模式样式 */
.dark .glass-card {
  background: rgba(30, 41, 59, 0.7); /* 深蓝灰色半透明背景 */
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1); /* 微妙的亮色边框 */
}

/* 
  使用 :deep() 来覆盖 Element Plus 输入框在深色模式下的默认样式，
  使其更好地融入我们的玻璃拟态设计。
*/
:deep(.dark .el-input__wrapper) {
  background-color: rgba(0, 0, 0, 0.25) !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.dark .el-input__inner) {
  color: #e5e7eb !important; /* 浅灰色字体 */
}
</style>