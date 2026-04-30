import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import AppLayout from '../views/AppLayout.vue'
import CreateBillView from '../views/CreateBillView.vue'
import BillsView from '../views/BillsView.vue'
import BillDetailView from '../views/BillDetailView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import ConnectOnboardingView from '../views/ConnectOnboardingView.vue'
import ConnectRefreshView from '../views/ConnectRefreshView.vue'
import NotFoundView from '../views/NotFoundView.vue'

function isAuthenticated() {
  try {
    const raw = localStorage.getItem('instant_merchant_auth')
    if (!raw) return false
    const parsed = JSON.parse(raw)
    return !!parsed?.token
  } catch {
    return false
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      meta: { guestOnly: true },
    },
    {
      path: '/connect/success',
      name: 'connect-success',
      component: ConnectOnboardingView,
      meta: { requiresAuth: true },
    },
    {
      path: '/connect/refresh',
      name: 'connect-refresh',
      component: ConnectRefreshView,
      meta: { requiresAuth: true },
    },
    {
      path: '/app',
      component: AppLayout,
      children: [
        {
          path: 'create',
          name: 'create',
          component: CreateBillView,
        },
        {
          path: 'bills',
          name: 'bills',
          component: BillsView,
          meta: { requiresAuth: true },
        },
        {
          path: 'bill/:id',
          name: 'bill-detail',
          component: BillDetailView,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authenticated = isAuthenticated()

  if (to.meta.requiresAuth && !authenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.guestOnly && authenticated) {
    next({ name: 'create' })
    return
  }

  next()
})

export default router
