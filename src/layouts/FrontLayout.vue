<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import { Search, Sunny, Moon } from '@element-plus/icons-vue'
import { useTheme } from '@/utils/useTheme'

// 使用 useTheme 钩子，它会自动处理主题的初始化和切换
const { isDark, toggleTheme } = useTheme()

const route = useRoute()
const activeIndex = computed(() => route.path)

const isLoggedIn = ref(false)

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
  // 检查是否存在令牌
  isLoggedIn.value = !!localStorage.getItem('blog-token')
})

</script>

<template>
  <el-container class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- 顶部导航 -->
    <el-header class="fixed w-full z-50 glass-effect !h-[60px] !p-0">
      <div class="container h-full flex items-center justify-between">
        <div class="flex items-center h-full">
          <RouterLink to="/"
            class="text-xl font-bold text-gray-900 dark:text-white mr-10 flex items-center transition-colors">
            <span class="text-blue-600 mr-2">●</span> My Blog
          </RouterLink>

          <el-menu :default-active="activeIndex" mode="horizontal" :ellipsis="false"
            class="!border-none !bg-transparent h-full" router>
            <el-menu-item index="/" class="dark:text-gray-300 dark:hover:text-white">首页</el-menu-item>
            <el-menu-item index="/category" class="dark:text-gray-300 dark:hover:text-white">分类/标签</el-menu-item>
          </el-menu>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Theme Toggle -->
          <el-button circle :icon="isDark ? Sunny : Moon" @click="toggleTheme"
            class="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300" />

          <RouterLink v-if="isLoggedIn" to="/admin">
            <el-button type="success" plain round size="small">进入后台</el-button>
          </RouterLink>
          <RouterLink v-else to="/login">
            <el-button type="primary" plain round size="small">博主登录</el-button>
          </RouterLink>
        </div>
      </div>
    </el-header>

    <!-- 内容区域 -->
    <el-main class="!pt-[80px] !pb-8 !px-0 flex-grow w-full">
      <div class="container mx-auto">
        <RouterView />
      </div>
    </el-main>

    <!-- 底部 -->
    <el-footer class="!h-auto mt-auto mb-2">
      <div class="container mx-auto text-center text-gray-500 dark:text-gray-400 text-sm">
        <p class="mb-2">&copy; 2025 My Personal Blog. All rights reserved.</p>
        <p class="text-xs text-gray-400 dark:text-gray-500">Designed with Element Plus & Vue 3</p>
      </div>
    </el-footer>
  </el-container>
</template>

<style scoped>
:deep(.el-menu-item) {
  font-size: 15px;
  color: var(--text-color-secondary);
}

:deep(.el-menu-item.is-active) {
  color: var(--el-color-primary);
  font-weight: 500;
  border-bottom: 2px solid var(--el-color-primary);
}

:deep(.el-menu-item:hover) {
  background-color: transparent !important;
  color: var(--el-color-primary);
}
</style>