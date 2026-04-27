import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import AppLayout from '../views/AppLayout.vue'
import CreateBillView from '../views/CreateBillView.vue'
import BillsView from '../views/BillsView.vue'
import BillDetailView from '../views/BillDetailView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingView,
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

export default router
