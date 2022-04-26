import Vue from 'vue'
import {
  Pagination,
  Dialog,
  Select,
  Submenu,
  Menu,
  MenuItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Option,
  Button,
  Table,
  TableColumn,
  DatePicker,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Icon,
  Row,
  Col,
  Upload,
  Progress,
  Card,
  Loading,
  MessageBox,
  Message,
  Checkbox,
  Notification,
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './http'
// 解决低版本浏览器不支持 promise问题
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()

Vue.config.productionTip = false
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Card)
Vue.use(Checkbox)
Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
Vue.prototype.$notify = Notification

Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
