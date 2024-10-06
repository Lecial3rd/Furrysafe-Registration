import { createRouter, createWebHistory } from 'vue-router';
import RegistrationView from '../views/RegistrationView.vue';
import ImageUploadView from '../views/ImageUploadView.vue';
import MapView from '../views/MapView.vue';
import ChatView from '../views/ChatView.vue';
import LoginView from '../views/LoginView.vue';

const routes = [
  {
    path: '/image',
    name: 'ImageUpload',
    component: ImageUploadView,
  },
  {
    path: '/map',
    name: 'Map',
    component: MapView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegistrationView,
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatView,
    meta: { requiresAuth: true }, // Add requiresAuth meta to protect this route
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Authentication guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const userId = sessionStorage.getItem('user_id'); // Check sessionStorage instead of localStorage

  if (requiresAuth && !userId) {
    next('/login'); // Redirect to login if the user is not authenticated
  } else {
    next(); // Proceed to the requested route
  }
});

export default router;
