<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import request from '@/api/request'
import { useTheme } from '@/utils/useTheme'

const { isDark } = useTheme()
const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const loading = ref(false)
const saving = ref(false)
const title = ref('')
const content = ref('')

// 计算编辑器主题
const editorTheme = computed(() => isDark.value ? 'dark' : 'light')

// 工具栏配置 - 包含用户要求的加粗、标题、代码块、图片等
const toolbars: any[] = [
    'bold',
    'italic',
    'strikeThrough',
    '-',
    'title',
    'quote',
    'unorderedList',
    'orderedList',
    'task',
    '-',
    'codeRow',
    'code',
    'link',
    'image',
    'table',
    '-',
    'revoke',
    'next',
    'save',
    '=',
    'pageFullscreen',
    'fullscreen',
    'preview',
    'htmlPreview',
    'catalog'
]

const fetchArticle = async () => {
    if (!id) return
    loading.value = true
    try {
        const res = await request.get(`/posts/${id}`)
        title.value = res.data.title
        content.value = res.data.content
    } catch (error) {
        ElMessage.error('获取文章失败')
    } finally {
        loading.value = false
    }
}

const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
    const res = await Promise.all(
        files.map((file) => {
            return new Promise((rev, rej) => {
                const form = new FormData();
                form.append('image', file);

                request.post('/upload', form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }).then((res) => rev(res))
                    .catch((e) => rej(e));
            });
        })
    );

    // 将上传后的 URL 回传给编辑器显示
    callback(res.map((item: any) => item.data.url));
};

const handleSave = async () => {
    if (!title.value.trim() || !content.value.trim()) {
        ElMessage.warning('标题和内容不能为空')
        return
    }

    saving.value = true
    try {
        if (id) {
            await request.put(`/posts/${id}`, {
                title: title.value,
                content: content.value
            })
            ElMessage.success('更新成功')
        } else {
            await request.post('/posts', {
                title: title.value,
                content: content.value
            })
            ElMessage.success('创建成功')
        }
        router.push({ name: 'admin-articles' })
    } catch (error) {
        ElMessage.error('保存失败')
    } finally {
        saving.value = false
    }
}

onMounted(() => {
    fetchArticle()
})
</script>

<template>
    <div class="h-full flex flex-col pb-4">
        <!-- 顶部操作栏 -->
        <div class="flex items-center justify-between mb-4 bg-secondary p-3 rounded-lg shadow-sm">
            <div class="flex items-center flex-1 mr-4">
                <el-button :icon="ArrowLeft" circle @click="router.back()" class="mr-4" title="返回" />
                <el-input v-model="title" placeholder="输入文章标题..."
                    class="text-xl font-bold !border-none custom-title-input" />
            </div>
            <div class="flex items-center space-x-2">
                <el-button type="primary" :icon="Check" :loading="saving" @click="handleSave">
                    {{ id ? '保存修改' : '立即发布' }}
                </el-button>
            </div>
        </div>

        <!-- 编辑器区域 -->
        <div class="flex-1 overflow-hidden rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <MdEditor v-model="content" :toolbars="toolbars" :theme="editorTheme" class="h-full !border-none"
                placeholder="在这里书写你的 Markdown 内容..." preview-theme="github" @onUploadImg="onUploadImg" />
        </div>
    </div>
</template>

<style scoped>
:deep(.custom-title-input .el-input__wrapper) {
    box-shadow: none !important;
    background: transparent !important;
    padding: 0;
}

:deep(.custom-title-input .el-input__inner) {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--el-text-color-primary);
}

:deep(.md-editor) {
    height: 100%;
}

/* 适配暗色模式下的编辑器背景 */
.dark :deep(.md-editor) {
    --md-bk-color: #1a1a1a;
}
</style>
