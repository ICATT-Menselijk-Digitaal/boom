import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UploadView from '../views/UploadView.vue'
import MappingView from '../views/MappingView.vue'
import PreView from '@/views/PreView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/upload',
      name: 'upload',
      component: UploadView,
    },
    {
      path: '/mapping',
      name: 'mapping',
      component: MappingView,
    },
    {
      path: '/preview',
      name: 'preview',
      component: PreView,
    },
  ],
})

export default router
