const axios = require("axios")
import { Message, Loading } from 'element-ui';
import router from './router/index'

let loading;
// 加载动画
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: "加载中",
    background: "rgba(0, 0, 0, 0.75)"
  })
}
// 结束加载动画
function endLoading() {
  loading.close();
}

axios.defaults.timeout = 5000;
// 请求拦截
axios.interceptors.request.use(config => {
  // 请求开始时加载动画开始
  startLoading();
  // localStorage.eleToken 存在时设置统一的请求头 授权
  if (localStorage.eleToken) {
    config.headers.Authorization = localStorage.eleToken
  }
  return config;
}, err => {
  return Promise.reject(err)
})

// 响应拦截
axios.interceptors.response.use(
  response => {
    // 响应有结果了结束动画
    endLoading()
    return response
  },
  error => {
    endLoading()
    // 查看状态码是不是 401 ,如果是则表示 token 已过期
    // 获取状态码
    const {status} = error.response
    if (status === 401) {
      // 错误提醒
      Message.error("登录已过期，请重新登录")
      // 清除 token 
      localStorage.removeItem('eleToken');
      // 跳转到登录页
      router.push('/login');
    }
    return Promise.reject(error)
  }
)

export default axios;

