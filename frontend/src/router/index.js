import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserAccount from '../views/UserAccount.vue'
import AuthCallback from '../views/AuthCallback.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: AuthCallback,
    },
    {
      path: '/account',
      name: 'account',
      component: UserAccount,
    },
  ],
})

export default router
