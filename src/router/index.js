import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import("../components/Home.vue"),
    },
    {
      path: '/gamerecords',
      name: 'GameRecords',
      component: () => import("../components/GameRecords.vue"),
    },
    {
      path: '/addrecord',
      name: 'AddRecord',
      component: () => import("../components/AddRecord.vue"),
    },
  ],
})

export default router