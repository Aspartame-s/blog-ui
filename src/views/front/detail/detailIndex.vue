<!-- /Users/chengjiahui/blog/blog-ui/src/views/front/detail/detailIndex.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue' // 1. 引入 computed
import { useRoute, useRouter } from 'vue-router'
import { Calendar, User, ArrowLeft } from '@element-plus/icons-vue'
import request from '@/api/request'
import { marked } from 'marked' // 2. 引入 marked

interface Article {
  id: number;
  title: string;
  content: string;
  created_at: string;
  username: string;
}

const route = useRoute()
const router = useRouter()
const articleId = route.params.id

const article = ref<Article | null>(null)
const loading = ref(true)

// 3. 创建一个计算属性来解析 Markdown
const parsedContent = computed(() => {
  if (article.value && article.value.content) {
    // 将 Markdown 字符串转换为 HTML
    return marked(article.value.content);
  }
  return '';
});

const fetchArticle = async () => {
  if (!articleId) return;
  loading.value = true;
  try {
    const res = await request.get(`/posts/${articleId}`);
    article.value = res.data;
  } catch (error) {
    console.error("获取文章详情失败:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchArticle();
});

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <el-button @click="goBack" text class="mb-6 hover:text-blue-600">
      <el-icon class="mr-1"><ArrowLeft /></el-icon> 返回列表
    </el-button>

    <el-card 
      v-loading="loading"
      class="!border-none !rounded-lg shadow-sm overflow-hidden dark:bg-gray-800 transition-colors min-h-[500px]"
    >
      <div v-if="article">
        <div class="border-b border-gray-100 dark:border-gray-700 pb-6 mb-8">
          <div class="flex items-center space-x-2 mb-4">
            <span class="text-gray-500 text-sm flex items-center">
              <el-icon class="mr-1"><Calendar /></el-icon> 
              {{ new Date(article.created_at).toLocaleDateString() }}
            </span>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            {{ article.title }}
          </h1>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ article.username }}</span>
            </div>
          </div>
        </div>

        <!-- 4. 将 v-html 绑定到新的计算属性 -->
        <div class="article-content prose prose-lg max-w-none prose-blue dark:prose-invert" v-html="parsedContent"></div>
      </div>
      <el-empty v-else-if="!loading" description="文章不存在或加载失败" />
    </el-card>
  </div>
</template>

<style>
/* 保持样式不变 */
.article-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--el-text-color-primary);
}
.article-content p {
  margin-bottom: 1.25rem;
  line-height: 1.75;
  color: var(--el-text-color-regular);
}
.article-content ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
  color: var(--el-text-color-regular);
}
.article-content li {
  margin-bottom: 0.5rem;
}
.article-content blockquote {
  border-left: 4px solid #4299e1;
  padding-left: 1rem;
  margin-left: 0;
  margin-right: 0;
  font-style: italic;
  color: var(--el-text-color-secondary);
  background-color: var(--el-fill-color-light);
  padding: 1rem;
  border-radius: 0.25rem;
}
.article-content pre {
  background-color: #2d3748;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1.25rem;
}
.article-content code {
  font-family: monospace;
}
</style>