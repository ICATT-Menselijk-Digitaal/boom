import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UploadView from '../views/UploadView.vue'
import MappingView from '../views/MappingView.vue'
import PreView from '@/views/PreView.vue'
import { isUploaded } from '@/store'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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

// Navigation guard to return to home if a page is requested but the nav state is not high enough
router.beforeEach((to) => {
  const toName = to.name?.toString() || ''
  if (['mapping', 'preview'].includes(toName) && isUploaded.value === false) {
    return { name: 'home' }
  }
})
export default router
