import { createRouter, createWebHistory } from 'vue-router'
import RegistrationView from '../views/RegistrationView.vue'
import ImageUploadView from '../views/ImageUploadView.vue' 
import MapView from '../views/MapView.vue'

const routes = [
  {
    path: '/image',
    name: 'ImageUpload',
    component: ImageUploadView 
  },
  {
    path: '/map',
    name: 'Map',
    component: MapView 
  },
  {
    path: '/register',
    name: 'Register',
    component: RegistrationView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
