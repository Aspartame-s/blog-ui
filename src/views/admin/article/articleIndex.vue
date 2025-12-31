<!-- /Users/chengjiahui/blog/blog-ui/src/views/admin/article/articleIndex.vue -->
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus, Edit, Delete, Search, View } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/api/request'
import { useRouter } from 'vue-router'

// 1. 更新 Article 接口以匹配后端数据
interface Article {
  id: number
  title: string
  content: string
  created_at: string
  username: string
}

const router = useRouter()
const tableData = ref<Article[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const total = ref(0)



// 2. 获取文章列表的函数
const fetchArticles = async () => {
  loading.value = true
  try {
    const res = await request.get('/posts')
    tableData.value = res.data
    total.value = res.total
    console.log(res)
  } finally {
    loading.value = false
  }
}

// 3. 在组件挂载时获取数据
onMounted(() => {
  fetchArticles()
})

const handleEdit = (row: Article) => {
  router.push({ name: 'admin-article-edit', params: { id: row.id } })
}

// 4. 实现真实的删除逻辑
const handleDelete = (row: Article) => {
  ElMessageBox.confirm('确定要删除这篇文章吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await request.delete(`/posts/${row.id}`)
    ElMessage.success('删除成功')
    await fetchArticles() // 重新获取列表
  })
}

const handleCreate = () => {
  router.push({ name: 'admin-article-edit' })
}

const handleView = (row: Article) => {
  console.log(row.id)
  router.push({ name: 'article-detail', params: { id: row.id } })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">文章管理</h2>
      <el-button type="primary" :icon="Plus" @click="handleCreate">新建文章</el-button>
    </div>

    <el-card class="!border-none !rounded-lg shadow-sm">
      <div class="mb-4 flex">
        <el-input v-model="searchKeyword" placeholder="搜索文章标题..." class="!w-64 mr-4" :prefix-icon="Search" clearable />
      </div>

      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="username" label="作者" width="120" />
        <el-table-column prop="created_at" label="发布日期" width="180">
          <template #default="scope">
            {{ new Date(scope.row.created_at).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button link type="primary" :icon="View" @click="handleView(scope.row)">查看</el-button>
            <el-button link type="primary" :icon="Edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="danger" :icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件可以暂时保留，待后端实现分页功能后再对接 -->
      <div class="mt-8 flex justify-end w-full items-center">
        <el-pagination background layout="prev, pager, next" :total="total" />
      </div>
    </el-card>


  </div>
</template>