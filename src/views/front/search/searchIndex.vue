<script setup lang="ts">
import { ref } from 'vue'
import { Search, Document } from '@element-plus/icons-vue'

const keyword = ref('')
const results = ref<any[]>([])
const hasSearched = ref(false)

const handleSearch = () => {
  if (!keyword.value.trim()) return
  
  hasSearched.value = true
  // 模拟搜索结果
  setTimeout(() => {
    results.value = [
      { 
        id: 1, 
        title: `Vue 3 Composition API 深度解析`, 
        summary: `关于 "${keyword.value}" 的相关内容：本文深入探讨了 Vue 3 的组合式 API，包括 ref, reactive, computed 等核心概念...`,
        date: '2025-05-20'
      },
      { 
        id: 2, 
        title: `TypeScript 高级特性与实战`, 
        summary: `在项目中如何优雅地使用 TypeScript？本文将结合 "${keyword.value}" 相关的实际场景进行讲解...`,
        date: '2025-05-18'
      }
    ]
  }, 500)
}
</script>

<template>
  <div class="max-w-3xl mx-auto py-8">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">站内搜索</h1>
      <p class="text-gray-500 dark:text-gray-400">查找你感兴趣的文章或教程</p>
    </div>

    <div class="flex gap-4 mb-12">
      <el-input 
        v-model="keyword" 
        placeholder="请输入关键词..." 
        size="large" 
        class="!text-lg"
        :prefix-icon="Search"
        clearable
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
    </div>

    <div v-if="hasSearched">
      <div v-if="results.length > 0" class="space-y-6">
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">找到 {{ results.length }} 个相关结果</p>
        <el-card 
          v-for="res in results" 
          :key="res.id" 
          class="!border-none !rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-750"
        >
          <div class="flex items-start">
            <el-icon class="text-gray-400 text-xl mr-4 mt-1"><Document /></el-icon>
            <div>
              <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2 hover:underline">{{ res.title }}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">{{ res.summary }}</p>
              <span class="text-xs text-gray-400 dark:text-gray-500">{{ res.date }}</span>
            </div>
          </div>
        </el-card>
      </div>
      <el-empty v-else description="未找到相关内容，换个关键词试试？" />
    </div>
    
    <div v-else class="text-center text-gray-400 py-12">
      <el-icon class="text-6xl mb-4"><Search /></el-icon>
      <p>输入关键词开始搜索</p>
    </div>
  </div>
</template>