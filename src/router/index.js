import { createRouter, createWebHistory } from 'vue-router'
import { userState } from '/src/state/userState'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import("../components/Home.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: '/gamerecords',
      name: 'GameRecords',
      component: () => import("../components/GameRecords.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: '/addrecord',
      name: 'AddRecord',
      component: () => import("../components/AddRecord.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import("../components/Login.vue"),
    },
    {
      path: '/usersearch',
      name: 'UserSearch',
      component: () => import("../components/UserSearch.vue"),
    },
    {
      path: '/profile/:username',
      name: 'Profile',
      component: () => import("../components/Profile.vue"),
    },
    {
      path: '/dominioncounter',
      name: 'DominionCounter',
      component: () => import("../components/DominionCounter.vue"),
    },
    {
      path: '/dominionselector',
      name: 'DominionSeletor',
      component: () => import("../components/DominionSelector.vue"),
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !userState.isLoggedIn) {
    // Redirect to login page if the route requires authentication and user is not logged in
    next('/login')
  } else if (to.path === '/login' && userState.isLoggedIn) {
    // Redirect to home if user is already logged in and tries to access login page
    next('/')
  } else {
    // Proceed as normal for all other cases
    next()
  }
})

export default router
