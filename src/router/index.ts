import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 前台路由
    {
      path: '/',
      component: () => import('@/layouts/FrontLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/front/home/homeIndex.vue') // 修正路径
        },
        {
          path: 'article/:id',
          name: 'article-detail',
          component: () => import('@/views/front/detail/detailIndex.vue') // 修正路径
        },
        {
          path: 'category',
          name: 'category',
          // 注意：请确认你的文件夹拼写是 category 还是 categary
          component: () => import('@/views/front/category/categoryIndex.vue')
        },
        {
          path: 'search',
          name: 'search',
          component: () => import('@/views/front/search/searchIndex.vue') // 修正路径
        }
      ]
    },
    // 后台登录
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/admin/login/loginIndex.vue')
    },
    // 后台管理
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      children: [
        {
          path: '',
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/dashboard/dashboardIndex.vue'),
          meta: { title: '仪表盘' }
        },
        {
          path: 'articles',
          name: 'admin-articles',
          component: () => import('@/views/admin/article/articleIndex.vue'),
          meta: { title: '文章管理' }
        },
        {
          path: 'articles/edit/:id?',
          name: 'admin-article-edit',
          component: () => import('@/views/admin/article/articleEdit.vue'),
          meta: { title: '文章编辑' }
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: () => import('@/views/admin/settings/settingsIndex.vue')
        }
      ]
    }
  ]
})

export default router