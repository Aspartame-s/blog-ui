<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { 
  Odometer, 
  Document, 
  Setting, 
  Fold, 
  Expand,
  SwitchButton,
  UserFilled,
  Sunny,
  Moon
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useTheme } from '@/utils/useTheme'

// 使用 useTheme 钩子，它会自动处理主题的初始化和切换
const { isDark, toggleTheme } = useTheme()

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)

// Initialize theme based on DOM
if (typeof document !== 'undefined') {
  isDark.value = document.documentElement.classList.contains('dark')
}

const activeMenu = computed(() => route.path)

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    router.push('/login')
  })
}
</script>

<template>
  <el-container class="h-screen bg-default">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '240px'" class="transition-all duration-300 bg-secondary shadow-md z-10 flex flex-col">
      <div class="h-16 flex items-center justify-center border-b border-color">
        <!-- Removed Blog Admin text as requested -->
        <span v-if="!isCollapse" class="text-xl font-bold text-primary">B</span>
        <span v-else class="text-xl font-bold text-primary">B</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        class="border-none flex-grow"
        :collapse="isCollapse"
        router
        background-color="transparent"
        text-color="var(--text-color-secondary)"
        active-text-color="var(--primary-color)"
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><Odometer /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>
        <el-menu-item index="/admin/articles">
          <el-icon><Document /></el-icon>
          <template #title>文章管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/settings">
          <el-icon><Setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部 Header -->
      <el-header class="bg-secondary shadow-sm flex items-center justify-between px-6 z-10">
        <div class="flex items-center">
          <el-icon 
            class="text-xl cursor-pointer hover:text-primary transition-colors text-secondary" 
            @click="toggleSidebar"
          >
            <component :is="isCollapse ? Expand : Fold" />
          </el-icon>
          <el-breadcrumb class="ml-6" separator="/">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ route.meta.title || '当前页面' }}</el-breadcrumb-item>
          </el-breadcrumb>
          
          <el-button 
            link 
            type="primary" 
            class="ml-6" 
            @click="router.push('/')"
          >
            查看站点
          </el-button>
        </div>
        
        <div class="flex items-center space-x-4 ml-auto">
          <!-- Theme Toggle -->
          <el-button 
            circle 
            :icon="isDark ? Sunny : Moon" 
            @click="toggleTheme"
            class="mr-2"
          />
          
          <div class="flex items-center space-x-2 cursor-pointer hover:bg-secondary p-2 rounded-lg transition-colors">
            <el-avatar :size="32" :icon="UserFilled" class="bg-primary text-white" />
            <span class="text-sm font-medium text-primary">Admin</span>
          </div>
          <el-button circle :icon="SwitchButton" type="danger" plain @click="handleLogout" />
        </div>
      </el-header>

      <!-- 主要内容 -->
      <el-main class="bg-default p-6">
        <RouterView v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>