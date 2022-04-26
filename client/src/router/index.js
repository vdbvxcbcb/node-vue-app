import Vue from 'vue'
// 引入 Vue 路由
import VueRouter from 'vue-router'
import { Message } from 'element-ui'
// 使用 Vue 路由
Vue.use(VueRouter)

// 引入组件并懒加载
const Index = () => import('../views/Index')
const Register = () => import('../views/Register')
const Login = () => import('../views/Login')
const ForgotPassword = () => import('../views/ForgotPassword')
const Home = () => import('../views/Home')
const Info = () => import('../views/Info')
const NotFound = () => import('../views/404')
const FundList = () => import('../views/FundList')
const Tabs = () => import('../views/Tabs')

// 创建 routes 路由与子路由组成的数组（各个路径对应的组件与子组件）
const routes = [
  {
    path: '/',
    redirect: '/login', // 如果路径为 / 重定向为登录页
  },
  {
    path: '/index',
    component: Index,
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: '/home',
        name: 'home',
        component: Home,
      },
      {
        path: '/fundlist',
        name: 'fundlist',
        component: FundList,
      },
      {
        path: '/info',
        name: 'info',
        component: Info,
      },
      {
        path: '/tabs',
        name: 'tabs',
        component: Tabs,
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/forgot',
    name: 'forgot',
    component: ForgotPassword
  },
  {
    path: '*',
    name: '404',
    component: NotFound, // 其他路径则为 404
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

// 路由守卫 没登录之前只能访问注册页和登录页
router.beforeEach((to, from, next) => {
  // 获取 token ，有 token 代表已登录
  const isLogin = localStorage.eleToken
  // 如果已注册或已登录则正常访问所有页面
  if (
    to.path === '/register' ||
    to.path === '/login' ||
    to.path === '/forgot'
  ) {
    // next() 正常访问
    next()
  }
  // 否则想进入其他页面只能跳转到登录页
  else {
    isLogin ? next() : Message.error('请先登录') && next('/login')
  }
})

// 路由到登录界面时，强制页面reload
// router.afterEach((to,from)=>{
//     if(from.path != '/login' && from.path != '/' && to.path == '/login'){
//         window.location.reload();
//     }
// })
export default router
