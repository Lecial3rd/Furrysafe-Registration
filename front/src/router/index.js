import { createRouter, createWebHistory } from 'vue-router'
import MapView from '../views/MapView.vue'
import RegistrationView from '../views/RegistrationView.vue'
import ImageUploadView from '../views/ImageUploadView.vue'

const routes = [
  {
    path: '/map',
    name: 'Map',
    component: MapView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegistrationView
  },
  {
    path: '/upload-image',
    name: 'ImageUpload',
    component: ImageUploadView
  },
  {
    path: '/',
    redirect: '/map'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
