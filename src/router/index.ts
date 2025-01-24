import { createRouter, createWebHashHistory } from 'vue-router'

import * as settings from '@/settings'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    component: {},
    name: 'NotFound',
    path: '/:pathMatch(.*)*',
  },
  {
    children: [
      {
        // @ts-ignore
        component: () => import('@/views/redirect'),

        path: '/redirect/:path(.*)',
      },
    ],
    component: () => import('@/layout/index.vue'),
    hidden: true,
    path: '/redirect',
  },
  {
    component: () => import('@/views/login/index.vue'),
    hidden: true,
    meta: {
      title: settings.title,
    },
    name: 'login',
    path: '/login',
  },
  {
    children: [
      {
        component: () => import('@/views/home/index.vue'),
        meta: { affix: true, icon: 'Home', title: '首页' },
        name: 'Home',
        parentHidden: true,
        path: 'home',
      },
    ],
    component: () => import('@/layout/index.vue'),
    path: '/',
    redirect: '/home',
  },
  {
    children: [
      {
        component: () => import('@/views/account/Profile/index.vue'),
        meta: { title: '个人资料' },
        name: 'profile',
        path: 'profile',
      },
      {
        component: () => import('@/views/account/UpdatePwd/index.vue'),
        hidden: true,
        meta: { title: '修改密码' },
        name: '修改密码',
        path: 'updatePwd',
      },
    ],
    component: () => import('@/layout/index.vue'),
    hidden: true,
    path: '/account',
    redirect: 'noredirect',
  },
  {
    children: [
      {
        component: () => import('@/views/icons/index.vue'),
        hidden: true,
        meta: { icon: 'Icons', title: '图标库' },
        name: 'Icons',
        path: 'icons',
      },
    ],
    component: () => import('@/layout/index.vue'),
    hidden: true,
    path: '/',
    redirect: 'noredirect',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
