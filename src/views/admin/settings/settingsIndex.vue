<!-- 基础设置 -->
<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const form = ref({
  blogName: 'My Personal Blog',
  author: '博主',
  intro: '热爱技术，热爱分享。'
})

const saveSettings = () => {
  ElMessage.success('设置已保存')
}
</script>

<template>
  <div class="p-6 rounded-lg shadow-sm max-w-2xl">
    <h3 class="text-lg font-bold mb-6">博客设置</h3>
    <el-form :model="form" label-width="100px">
      <el-form-item label="博客名称">
        <el-input v-model="form.blogName" />
      </el-form-item>
      <el-form-item label="博主昵称">
        <el-input v-model="form.author" />
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input v-model="form.intro" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSettings">保存更改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>