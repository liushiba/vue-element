import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */

/** note: sub-menu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
 **/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/june'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/record',
    component: Layout,
    redirect: '/record/index',
    name: '申请记录',
    meta: {
      title: '申请记录',
      icon: 'table',
      roles: ['1', '2']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/record/index'),
        name: 'Record',
        meta: { title: '待审核', icon: 'guide', noCache: true, roles: ['1'] }
      },
      {
        path: 'list',
        component: () => import('@/views/record/list'),
        name: 'RecordList',
        meta: { title: '总记录', icon: 'list', noCache: true, roles: ['2'] }
      }
    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/list',
    name: 'Example',
    meta: {
      title: '活动',
      icon: 'example',
      roles: ['3', '4', '5']
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/activity/create'),
        name: 'CreateActivity',
        meta: { title: '新建活动', icon: 'edit', roles: ['3'] }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/activity/edit'),
        name: 'EditActivity',
        meta: { title: 'editActivity', noCache: true, roles: ['4'] },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/activity/list'),
        name: 'ActivityList',
        meta: { title: '活动列表', icon: 'list', roles: ['5'] }
      }
    ]
  },
  {
    path: '/text',
    component: Layout,
    redirect: '/text/list',
    name: 'Text',
    meta: {
      title: '文本',
      icon: 'language',
      roles: ['6', '7', '8']
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/text/create'),
        name: 'CreateText',
        meta: { title: '新建文本', icon: 'edit', roles: ['6'] }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/text/edit'),
        name: 'EditText',
        meta: { title: '编辑文本', noCache: true, roles: ['7'] },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/text/list'),
        name: 'TextList',
        meta: { title: '文本列表', icon: 'list', roles: ['8'] }
      }
    ]
  },
  {
    path: '/admin',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/admin/index'),
        name: 'Admin',
        meta: { title: '系统管理', icon: 'lock', roles: ['9'] }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
