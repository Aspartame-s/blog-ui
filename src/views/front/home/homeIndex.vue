<!-- /Users/chengjiahui/blog/blog-ui/src/views/front/home/homeIndex.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar, ArrowRight } from '@element-plus/icons-vue'
import request from '@/api/request'

// 1. 定义文章接口以匹配后端
// 1. 定义文章接口以匹配后端
interface Article {
  id: number
  title: string
  content: string
  created_at: string
  username: string
}

const router = useRouter()
const articles = ref<Article[]>([])
const loading = ref(false)
const total = ref(0)

// 2. 获取文章列表的函数
const fetchArticles = async () => {
  loading.value = true
  try {
        const res = await request.get('/posts')
    console.log(res)
    articles.value = res.data
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// 3. 在组件挂载时获取数据
onMounted(() => {
  fetchArticles()
})

const goToDetail = (id: number) => {
  // 4. 使用命名路由跳转
  router.push({ name: 'article-detail', params: { id } })
}

// 辅助函数：从内容生成摘要
const getSummary = (content: string) => {
  if (!content) return ''
  return content.length > 100 ? content.substring(0, 100) + '...' : content
}
</script>

<template>
  <el-row :gutter="24">
    <!-- 左侧文章列表 -->
    <el-col :xs="24" :sm="24" :md="17" :lg="17" :xl="17">
      <div v-loading="loading" class="space-y-6 min-h-[400px]">
        <el-card 
          v-for="article in articles" 
          :key="article.id" 
          class="article-card !border-none !rounded-lg hover:!shadow-lg transition-all duration-300 cursor-pointer group dark:bg-gray-800 dark:hover:bg-gray-750"
          :body-style="{ padding: '0px' }"
          @click="goToDetail(article.id)"
        >
          <div class="flex flex-col md:flex-row h-full">
            <!-- 文章封面图 -->
            <div class="w-full md:w-1/3 h-48 md:h-auto overflow-hidden relative">
              <img 
                src="https://picsum.photos/800/400" 
                alt="cover" 
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            
            <!-- 文章内容 -->
            <div class="p-6 flex flex-col justify-between w-full md:w-2/3">
              <div>
                <h2 class="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                  {{ article.title }}
                </h2>
                <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 md:line-clamp-3 mb-4">
                  {{ getSummary(article.content) }}
                </p>
              </div>
              
              <div class="flex items-center justify-between text-xs text-gray-400 mt-auto">
                <div class="flex items-center space-x-4">
                  <span class="flex items-center">
                    <el-icon class="mr-1"><Calendar /></el-icon>
                    {{ new Date(article.created_at).toLocaleDateString() }}
                  </span>
                </div>
                <span class="flex items-center text-blue-500 group-hover:translate-x-1 transition-transform">
                  阅读全文 <el-icon class="ml-1"><ArrowRight /></el-icon>
                </span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 分页 -->
        <div v-if="!loading && articles.length > 0" class="flex justify-center mt-8 p-4 rounded-lg shadow-sm transition-colors">
          <el-pagination background layout="prev, pager, next" :total="total" />
        </div>
      </div>
    </el-col>

    <!-- 右侧侧边栏 (保持不变) -->
    <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="hidden md:block">
       <div class="sticky top-[80px] space-y-6">
        <!-- 个人简介 -->
        <el-card class="!border-none !rounded-lg shadow-sm text-center dark:bg-gray-800 transition-colors">
          <div class="flex flex-col items-center">
            <el-avatar :size="80" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" class="mb-4" />
            <h3 class="font-bold text-lg">Cheng Jiahui</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-2 mb-4">全栈开发者 / 技术博主 / 终身学习者</p>
            <div class="flex space-x-3 justify-center w-full">
              <el-button type="primary" round size="small" class="w-24">关注我</el-button>
              <el-button round size="small" class="w-24">私信</el-button>
            </div>
            <div class="flex justify-center space-x-6 mt-6 text-gray-400">
              <div class="flex flex-col items-center">
                <span class="font-bold text-lg">42</span>
                <span class="text-xs">文章</span>
              </div>
              <div class="flex flex-col items-center">
                <span class="font-bold text-lg">1.2k</span>
                <span class="text-xs">访问</span>
              </div>
              <div class="flex flex-col items-center">
                <span class="font-bold text-lg">89</span>
                <span class="text-xs">点赞</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 热门分类 -->
        <el-card class="!border-none !rounded-lg shadow-sm dark:bg-gray-800 transition-colors" header="热门分类">
          <div class="flex flex-wrap gap-2">
            <el-tag class="cursor-pointer hover:scale-105 transition-transform" type="success" effect="light">Vue 3</el-tag>
            <el-tag class="cursor-pointer hover:scale-105 transition-transform" type="warning" effect="light">JavaScript</el-tag>
            <el-tag class="cursor-pointer hover:scale-105 transition-transform" type="danger" effect="light">TypeScript</el-tag>
            <el-tag class="cursor-pointer hover:scale-105 transition-transform" type="info" effect="light">DevOps</el-tag>
            <el-tag class="cursor-pointer hover:scale-105 transition-transform" effect="light">React</el-tag>
            <el-tag class="cursor-pointer hover:scale-105 transition-transform" type="warning" effect="light">Node.js</el-tag>
          </div>
        </el-card>

        <!-- 推荐阅读 -->
        <el-card class="!border-none !rounded-lg shadow-sm dark:bg-gray-800 transition-colors" header="推荐阅读">
          <ul class="space-y-3">
            <li v-for="i in 5" :key="i" class="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer truncate flex items-center">
              <span class="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mr-2 flex-shrink-0"></span>
              <span>2025年前端开发路线图详解</span>
            </li>
          </ul>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.article-card:hover {
  transform: translateY(-2px);
}
</style>