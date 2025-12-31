<script setup lang="ts">
import { ref } from 'vue'
import { View, Document, ChatDotRound, Star } from '@element-plus/icons-vue'

const stats = ref([
  { title: '总文章数', value: 42, icon: Document, color: '#409EFF', bg: 'rgba(64, 158, 255, 0.1)' },
  { title: '总访问量', value: '12.5k', icon: View, color: '#67C23A', bg: 'rgba(103, 194, 58, 0.1)' },
  { title: '总评论数', value: 128, icon: ChatDotRound, color: '#A300D6', bg: 'rgba(163, 0, 214, 0.1)' },
  { title: '总点赞数', value: 892, icon: Star, color: '#E6A23C', bg: 'rgba(230, 162, 60, 0.1)' },
])
</script>

<template>
  <div class="dashboard-container">
    <h2 class="page-title">仪表盘</h2>
    
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" v-for="item in stats" :key="item.title">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="icon-wrapper" :style="{ color: item.color, backgroundColor: item.bg }">
              <el-icon :size="24"><component :is="item.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">{{ item.title }}</div>
              <div class="stat-value">{{ item.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近动态 (模拟) -->
    <div class="timeline-section">
      <el-card class="timeline-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>最近动态</span>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item timestamp="2025-05-20" placement="top" type="primary">
            <el-card shadow="hover" class="activity-card">
              <h4>发布了新文章: Vue 3 Composition API 实战指南</h4>
              <p>Admin 提交于 2025-05-20 20:46</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2025-05-18" placement="top" type="success">
            <el-card shadow="hover" class="activity-card">
              <h4>发布了新文章: TypeScript 基础入门</h4>
              <p>Admin 提交于 2025-05-18 10:22</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2025-05-15" placement="top">
            <el-card shadow="hover" class="activity-card">
              <h4>系统更新: 优化了首页加载速度</h4>
              <p>Admin 提交于 2025-05-15 14:30</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  color: var(--el-text-color-primary);
}

.stat-card {
  margin-bottom: 20px;
  border: none;
  border-radius: 8px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.timeline-section {
  margin-top: 20px;
}

.timeline-card {
  border: none;
  border-radius: 8px;
}

.card-header {
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.activity-card h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.activity-card p {
  margin: 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
</style>