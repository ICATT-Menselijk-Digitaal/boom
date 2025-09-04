import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UploadView from '../views/UploadView.vue'
import MappingView from '../views/MappingView.vue'
import PreView from '@/views/PreView.vue'
import { computedNavState } from '@/store'

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
router.beforeEach((to) => {
  const toName = to.name?.toString() || ''
  if (['mapping', 'preview'].includes(toName) && computedNavState.value < 2) {
    return { name: 'home' }
  }
})
export default router
