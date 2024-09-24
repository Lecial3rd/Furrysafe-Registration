import { createRouter, createWebHistory } from 'vue-router'
import RegistrationView from '../views/RegistrationView.vue'
import ImageUploadView from '../views/ImageUploadView.vue' 
import MapView from '../views/MapView.vue'
import ChatView from '../views/ChatView.vue'
import LoginView from '../views/LoginView.vue';

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
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/chat/:userId/:receiverId',
    name: 'Chat',
    component: ChatView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
