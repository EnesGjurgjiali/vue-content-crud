import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PostCreate from '@/views/PostCreate.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/post-create',
      name: 'post-create',
      component: PostCreate,
    },
    {
      path: '/post-edit/:id',
      name: 'post-edit',
      component: PostCreate,
    },
  ],
})

export default router
