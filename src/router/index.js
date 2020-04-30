import Vue from 'vue'
import Router from 'vue-router'
import { getComponent } from '@/utils/utils'

// import me from './modules/me'
// import mall from './modules/mall'
// import market from './modules/market'

Vue.use(Router)


export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: getComponent('views/login/index'),
    meta: { isOpen: true, title: '登录' }
  },

  {
    path: '/',
    name: '',
    redirect: '/layout/me',
    component: getComponent('layout/index'),
    meta: { isOpen: true, title: '我的' }
  },

  {
    path: '/layout',
    name: 'layout',
    redirect: '/layout/me',
    component: getComponent('layout/index'),
    children: [
      {
        path: 'me',
        name: 'me',
        component: getComponent('views/me/index'),
        meta: { isOpen: true, title: '我的' }
      },
      {
        path: 'market',
        name: 'market',
        component: getComponent('views/market/index'),
        meta: { isOpen: true, title: '市场' }
      },
      {
        path: 'mall',
        name: 'mall',
        component: getComponent('views/mall/index'),
        meta: { isOpen: true, title: '订单' }
      },
      {
        path: 'order',
        name: 'order',
        component: getComponent('views/order/index'),
        meta: { isOpen: true, title: '个人' }
      }
    ]
  },

  {
    path: '/forgetpay',
    name: 'forgetpay',
    component: getComponent('views/forget_pay/index'),
    meta: { isOpen: true, title: '更改支付密码' }
  },
  {
    path: '/maincoin',
    name: 'maincoin',
    component: getComponent('views/maincoin/index'),
    meta: { isOpen: false, title: '主流货币' }
  },

  // {
  //   path: '/share',
  //   name: 'share',
  //   component: getComponent('views/share/index'),
  //   meta: { isOpen: true, title: '邀请好友' }
  // },

  // {
  //   path: '/download',
  //   name: 'download',
  //   component: getComponent('views/download/index'),
  //   meta: { isOpen: true, title: '下载' }
  // },

  // {
  //   path: '/raw_detail',
  //   name: 'raw_detail',
  //   component: getComponent('views/raw_detail/index'),
  //   meta: { isOpen: true, title: '原石明细' }
  // },
  {
    path: '/orderlist',
    name: 'orderlist',
    component: getComponent('views/orderlist/index'),
    meta: { isOpen: true, title: '订单详情' }
  },
  // {
  //   path: '/afc_detail',
  //   name: 'afc_detail',
  //   component: getComponent('views/afc_detail/index'),
  //   meta: { isOpen: true, title: 'AFC明细' }
  // },
  {
    path: '/auth',
    name: 'auth',
    component: getComponent('views/auth/index'),
    meta: { isOpen: true, title: '实名认证' }
  },
  // {
  //   path: '/server',
  //   name: 'server',
  //   component: getComponent('views/server/index'),
  //   meta: { isOpen: true, title: '服务商' }
  // },
  // {
  //   path: '/my_mall',
  //   name: 'my_mall',
  //   component: getComponent('views/my_mall/index'),
  //   meta: { isOpen: true, title: '我的商城' }
  // },
  // {
  //   path: '/my_mall_order',
  //   name: 'my_mall_order',
  //   component: getComponent('views/my_mall_order/index'),
  //   meta: { isOpen: true, title: '订单管理' }
  // },
  // {
  //   path: '/my_mall_pub',
  //   name: 'my_mall_pub',
  //   component: getComponent('views/my_mall_pub/index'),
  //   meta: { isOpen: true, title: '发布产品' }
  // },
  {
    path: '/notice',
    name: 'notice',
    component: getComponent('views/notice/index'),
    meta: { isOpen: true, title: '公告' }
  }
]

export const asyncRoutes = []

const createRouter = () => new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router

