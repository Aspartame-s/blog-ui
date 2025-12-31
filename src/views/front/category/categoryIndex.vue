<script setup lang="ts">
import { ref, computed } from 'vue'
import { Folder, PriceTag, Calendar, View, ArrowRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const categories = ref([
  { id: 1, name: 'Vue 3', count: 12, type: 'success', icon: 'https://api.iconify.design/logos:vue.svg' },
  { id: 2, name: 'React', count: 8, type: 'primary', icon: 'https://api.iconify.design/logos:react.svg' },
  { id: 3, name: 'TypeScript', count: 15, type: 'warning', icon: 'https://api.iconify.design/logos:typescript-icon.svg' },
  { id: 4, name: 'Node.js', count: 6, type: 'danger', icon: 'https://api.iconify.design/logos:nodejs-icon.svg' },
  { id: 5, name: 'CSS / Tailwind', count: 10, type: 'info', icon: 'https://api.iconify.design/logos:tailwindcss-icon.svg' },
  { id: 6, name: 'DevOps', count: 4, type: '', icon: 'https://api.iconify.design/logos:docker-icon.svg' },
])

const tags = ref([
  'Composition API', 'Hooks', 'Vite', 'Webpack', 'Docker', 'K8s', 
  'Linux', 'Nginx', 'Git', 'Algorithm', 'Design Pattern', 'Performance',
  'Security', 'HTTP', 'Browser'
])

const mockArticles = ref([
  { id: 1, title: 'Vue 3 Composition API 实战指南', date: '2025-05-20', category: 'Vue 3', tags: ['Composition API', 'Vite'], views: 1205 },
  { id: 2, title: 'TypeScript 基础入门', date: '2025-05-18', category: 'TypeScript', tags: ['TypeScript'], views: 850 },
  { id: 3, title: 'Tailwind CSS 最佳实践', date: '2025-05-15', category: 'CSS / Tailwind', tags: ['CSS / Tailwind', 'Performance'], views: 920 },
  { id: 4, title: '前端性能优化实战', date: '2025-05-10', category: 'Vue 3', tags: ['Performance', 'Browser'], views: 1500 },
  { id: 5, title: 'React Hooks 深度解析', date: '2025-05-05', category: 'React', tags: ['Hooks'], views: 1100 },
])

const activeCategory = ref<string | null>(null)
const activeTag = ref<string | null>(null)

const filteredArticles = computed(() => {
  return mockArticles.value.filter(article => {
    const categoryMatch = !activeCategory.value || article.category === activeCategory.value
    const tagMatch = !activeTag.value || article.tags.includes(activeTag.value)
    return categoryMatch && tagMatch
  })
})

const selectCategory = (name: string) => {
  if (activeCategory.value === name) {
    activeCategory.value = null
  } else {
    activeCategory.value = name
    activeTag.value = null // Clear tag when category changes
  }
}

const selectTag = (tag: string) => {
  if (activeTag.value === tag) {
    activeTag.value = null
  } else {
    activeTag.value = tag
    activeCategory.value = null // Clear category when tag changes
  }
}

const clearFilters = () => {
  activeCategory.value = null
  activeTag.value = null
}

const goToDetail = (id: number) => {
  router.push({ name: 'article-detail', params: { id } })
}

// 随机颜色生成
const getRandomType = () => {
  const types = ['', 'success', 'info', 'warning', 'danger']
  return types[Math.floor(Math.random() * types.length)]
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12 space-y-16 animate-fade-in">
    <!-- 头部 -->
    <div class="text-center">
      <h1 class="text-4xl md:text-5xl font-extrabold mb-6">
        探索知识海洋
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        在这里，你可以通过分类和标签快速找到你感兴趣的技术文章。
      </p>
    </div>

    <!-- 分类卡片 -->
    <section>
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-2">
          <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center transition-colors">
            <el-icon class="text-blue-600 dark:text-blue-400 text-xl"><Folder /></el-icon>
          </div>
          <h2 class="text-2xl font-bold">文章分类</h2>
        </div>
        <el-button v-if="activeCategory || activeTag" link type="primary" @click="clearFilters">清除筛选</el-button>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="cat in categories" 
          :key="cat.id"
          @click="selectCategory(cat.name)"
          :class="[
            'group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden',
            activeCategory === cat.name 
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg ring-2 ring-blue-500/20' 
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-xl hover:-translate-y-1'
          ]"
        >
          <!-- 背景装饰 -->
          <div class="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity">
            <img :src="cat.icon" class="w-full h-full object-contain filter grayscale group-hover:grayscale-0" alt="">
          </div>

          <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center space-x-4">
              <div :class="['w-12 h-12 rounded-lg flex items-center justify-center transition-colors', activeCategory === cat.name ? 'bg-blue-600 text-white' : 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 group-hover:text-blue-600 dark:group-hover:text-blue-400']">
                <img :src="cat.icon" class="w-6 h-6" alt="">
              </div>
              <div>
                <h3 :class="['font-bold text-lg transition-colors', activeCategory === cat.name ? 'text-blue-700 dark:text-blue-400' : 'text-gray-800 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400']">
                  {{ cat.name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-500">{{ cat.count }} 篇文章</p>
              </div>
            </div>
            <el-icon :class="['transition-transform duration-300', activeCategory === cat.name ? 'text-blue-600' : 'text-gray-300 group-hover:translate-x-1 group-hover:text-blue-400']">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
      </div>
    </section>

    <!-- 标签云 -->
    <section>
      <div class="flex items-center space-x-2 mb-8">
        <div class="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center transition-colors">
          <el-icon class="text-green-600 dark:text-green-400 text-xl"><PriceTag /></el-icon>
        </div>
        <h2 class="text-2xl font-bold">热门标签</h2>
      </div>

      <div class="p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <div class="flex flex-wrap gap-4">
          <button 
            v-for="tag in tags" 
            :key="tag"
            @click="selectTag(tag)"
            :class="[
              'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
              activeTag === tag
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md'
            ]"
          >
            # {{ tag }}
          </button>
        </div>
      </div>
    </section>

    <!-- 搜索结果 -->
    <section v-if="activeCategory || activeTag" class="animate-slide-up">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold flex items-center">
          <span class="text-blue-600 dark:text-blue-400 mr-2">"{{ activeCategory || activeTag }}"</span> 
          下的文章
          <span class="ml-4 text-sm font-normal text-gray-500 dark:text-gray-500">共 {{ filteredArticles.length }} 篇</span>
        </h2>
      </div>

      <div v-if="filteredArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="article in filteredArticles" 
          :key="article.id"
          @click="goToDetail(article.id)"
          class="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <el-tag size="small" effect="plain" round>{{ article.category }}</el-tag>
              <span class="text-gray-300">·</span>
              <span class="text-xs text-gray-400 flex items-center">
                <el-icon class="mr-1"><Calendar /></el-icon> {{ article.date }}
              </span>
            </div>
            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3 line-clamp-2">
              {{ article.title }}
            </h3>
          </div>
          <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 dark:border-gray-700">
            <div class="flex items-center space-x-4 text-gray-400 text-xs">
              <span class="flex items-center">
                <el-icon class="mr-1"><View /></el-icon> {{ article.views }}
              </span>
            </div>
            <span class="text-blue-600 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
              阅读全文 <el-icon class="ml-1"><ArrowRight /></el-icon>
            </span>
          </div>
        </div>
      </div>
      <el-empty v-else description="暂无相关文章" />
    </section>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
