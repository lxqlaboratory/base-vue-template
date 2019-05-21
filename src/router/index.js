import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '车辆列表', icon: 'dashboard', affix: true }
    }]
  },

  {
    path: '/base-manage',
    component: Layout,
    redirect: '/base-manage',
    name: 'base-manage',
    meta: { title: '基础信息管理', icon: 'example' },
    children: [
      {
        path: 'vehiclemanage',
        name: 'vehiclemanage',
        component: () => import('@/views/base-manage/vehicle-manage'),
        meta: { title: '车辆管理', icon: 'table' }
      },
      {
        path: 'drivermanage',
        name: 'drivermanage',
        component: () => import('@/views/base-manage/driver-manage'),
        meta: { title: '驾驶员管理', icon: 'table' }
      },
      {
        path: 'fleetmanage',
        name: 'fleetmanage',
        component: () => import('@/views/base-manage/fleet-manage'),
        meta: { title: '车队管理', icon: 'table' }
      },
      {
        path: 'templatemanage',
        name: 'templatemanage',
        component: () => import('@/views/base-manage/template-manage'),
        meta: { title: '短信模板管理', icon: 'table' }
      }
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '统计分析', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: '里程统计', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: '超速统计', icon: 'tree' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: '疲劳统计', icon: 'tree' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    name: 'Example',
    meta: { title: '历史信息查询', icon: 'tool' },
    children: [
      {
        path: 'violationHistory',
        name: 'violationHistory',
        component: () => import('@/views/history-search/violation-history'),
        meta: { title: '违章历史查询', icon: 'table' }
      },
      {
        path: 'offlineWarning',
        name: 'offlineWarning',
        component: () => import('@/views/history-search/offline-warning'),
        meta: { title: '离线预警历史', icon: 'tree' }
      },
      {
        path: 'userMessage',
        name: 'userMessage',
        component: () => import('@/views/history-search/user-message'),
        meta: { title: '用戶消息历史', icon: 'tree' }
      },
      {
        path: 'terminalState',
        name: 'terminalState',
        component: () => import('@/views/history-search/terminal-state'),
        meta: { title: '終端状态历史', icon: 'tree' }
      },
      {
        path: 'terminalAlarm',
        name: 'terminalAlarm',
        component: () => import('@/views/history-search/terminal-alarm'),
        meta: { title: '終端报警历史', icon: 'tree' }
      },
      {
        path: 'checkHistory',
        name: 'checkHistory',
        component: () => import('@/views/history-search/check-history'),
        meta: { title: '查岗历史查询', icon: 'tree' }
      }
    ]
  },
  {
    path: '/networkMonitor ',
    component: Layout,
    name: 'networkMonitor',
    meta: { title: '联网监控', icon: 'tool' },
    children: [
      {
        path: 'violationDriverStatistic',
        name: 'violationDriverStatistic',
        component: () => import('@/views/network-control/violation-driver-statistic'),
        meta: { title: '驾驶员违章统计', icon: 'tree' }
      },
      {
        path: 'violationStatistic',
        name: 'violationStatistic',
        component: () => import('@/views/network-control/violation-statistic'),
        meta: { title: '违章统计', icon: 'tree' }
      }
      ]
  },
  {
    path: '/activeSafety ',
    component: Layout,
    name: 'activeSafety',
    meta: { title: '主动安全防御', icon: 'tool' },
    children: [
      {
        path: 'companyPortrait',
        name: 'companyPortrait',
        component: () => import('@/views/active-safety/company-portrait'),
        meta: { title: '企业画像', icon: 'tree' }
      },
      {
        path: 'driverPortrait',
        name: 'driverPortrait',
        component: () => import('@/views/active-safety/driver-portrait'),
        meta: { title: '驾驶员画像', icon: 'tree' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
