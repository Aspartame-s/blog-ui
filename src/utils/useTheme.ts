// /Users/chengjiahui/blog/blog-ui/src/composables/useTheme.ts
import { ref, watch, onMounted } from 'vue'

// 创建一个响应式的 ref 来持有当前主题状态
const isDark = ref(false)

export function useTheme() {
  // 函数，用于切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  // 监听 isDark 变化，并更新 <html> class 和 localStorage
  watch(isDark, (newVal) => {
    if (newVal) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  })

  // 组件挂载时，从 localStorage 初始化主题
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // 如果没有保存过，可以根据系统偏好来设置
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  })

  return {
    isDark,
    toggleTheme
  }
}