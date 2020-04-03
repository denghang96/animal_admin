import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message/index.vue')
      }
    ]
  },
  {
    path: '/user',
    name: '用户',
    meta: {
      icon: 'ios-body',
      title: '用户管理'
    },
    component: Main,
    children: [
      {
        path: 'user',
        name: '用户管理',
        meta: {
          icon: 'md-add',
          title: '用户管理',
          hideInBread: false
        },
        component: () => import('@/view/users/user.vue')
      },
    ]
  },
  {
    path: '/user_user',
    name: '个人中心',
    meta: {
      icon: 'ios-body',
      title: '个人中心'
    },
    component: Main,
    children: [
      {
        path: '/',
        name: '个人信息',
        meta: {
          icon: 'md-add',
          title: '个人信息',
          hideInBread: false
        },
        component: () => import('@/view/users/user_user.vue')
      },
      {
        path: '/',
        name: '我的寄养',
        meta: {
          icon: 'md-add',
          title: '我的寄养',
          hideInBread: false
        },
        component: () => import('@/view/users/user_user.vue')
      },
      {
        path: '/adoptapprovat_user',
        name: '我的领养',
        meta: {
          icon: 'md-add',
          title: '我的领养',
          hideInBread: false
        },
        component: () => import('@/view/approval/adoptapprovat_user.vue')
      },
      {
        path: '/support_user',
        name: '我的助养',
        meta: {
          icon: 'md-add',
          title: '我的助养',
          hideInBread: false
        },
        component: () => import('@/view/support/support_user.vue')
      }
    ]
  },
  {
    path: '/animal_user',
    name: '宠物之家',
    meta: {
      icon: 'ios-body',
      title: '宠物之家'
    },
    component: Main,
    children: [
      {
        path: '/',
        name: '宠物之家',
        meta: {
          icon: 'md-add',
          title: '宠物之家',
          hideInBread: false
        },
        component: () => import('@/view/animal/animal_user.vue')
      },
      {
        path: '/animal-detail',
        name: 'animal-detail',
        meta: {
          hideInMenu: true,
          title: '宠物详情',
        },
        component: () => import('@/view/animal/animal_detail.vue')
      },
      {
        path: '/animal-adopt',
        name: 'animal-adopt',
        meta: {
          hideInMenu: true,
          title: '领养申请',
        },
        component: () => import('@/view/animal/animal_adopt.vue')
      }
    ]
  },
  {
    path: '/animalmanage',
    name: '动物管理',
    meta: {
      icon: 'ios-body',
      title: '动物管理'
    },
    component: Main,
    children: [
      {
        path: 'add',
        name: '动物管理',
        meta: {
          icon: 'md-add',
          title: '动物管理',
          hideInBread: false
        },
        component: () => import('@/view/animal/animal.vue')
      },
    ]
  },
  {
    path: '/supportmanage',
    name: '助养记录',
    meta: {
      icon: 'ios-body',
      title: '助养记录'
    },
    component: Main,
    children: [
      {
        path: 'add',
        name: '助养记录',
        meta: {
          icon: 'md-add',
          title: '助养记录',
          hideInBread: false
        },
        component: () => import('@/view/support/support.vue')
      },
    ]
  },
  {
    path: '/interviewmanage',
    name: '领养回访管理',
    meta: {
      icon: 'ios-body',
      title: '领养回访管理'
    },
    component: Main,
    children: [
      {
        path: 'add',
        name: '领养回访',
        meta: {
          icon: 'md-add',
          title: '领养回访',
          hideInBread: false
        },
        component: () => import('@/view/interview/interview.vue')
      },
    ]
  },
  {
    path: '/consumemanage',
    name: '消费记录',
    meta: {
      icon: 'ios-body',
      title: '消费记录',
      access: ["consumemanage"]
    },
    component: Main,
    children: [
      {
        path: 'add',
        name: '消费记录',
        meta: {
          icon: 'md-add',
          title: '消费记录',
          hideInBread: false,
          access: ["consume"]
        },
        component: () => import('@/view/consume/consume.vue')
      },
    ]
  },
  {
    path: '/approval',
    name: '审批管理',
    meta: {
      icon: 'ios-body',
      title: '审批管理'
    },
    component: Main,
    children: [
      {
        path: 'adoptmanage',
        name: '领养申请审批',
        meta: {
          icon: 'md-add',
          title: '领养申请审批',
          hideInBread: false
        },
        component: () => import('@/view/approval/adoptapproval.vue')
      },
      {
        path: 'fostermanage',
        name: '寄养申请审批',
        meta: {
          icon: 'md-add',
          title: '寄养申请审批',
          hideInBread: false
        },
        component: () => import('@/view/foster/fosterapproval.vue')
      },
    ]
  },
  {
    path: '/comment',
    name: '评论管理',
    meta: {
      icon: 'ios-body',
      title: '评论管理'
    },
    component: Main,
    children: [
      {
        path: 'comment',
        name: '评论管理',
        meta: {
          icon: 'md-add',
          title: '评论管理',
          hideInBread: false
        },
        component: () => import('@/view/comment/comment.vue')
      },
    ]
  },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`,
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
