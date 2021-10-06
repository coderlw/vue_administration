import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import { message } from 'element-ui'
// 引入全局样式
import './assets/css/global.css'
// 引入less
import less from 'less'
// 引入字体图标
import './assets/fonts/iconfont.css'
// 引入axios
import axios from 'axios'
// 引入弹框
import { MessageBox } from 'element-ui';
// 引入tree-grid
import treeTable from 'vue-table-with-tree-grid';
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
axios.interceptors.request.use(config => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
Vue.prototype.$axios = axios;
Vue.prototype.$message = message;
Vue.prototype.$comfirm = MessageBox;
Vue.component('tree-table', treeTable);

Vue.use(less)
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
// 时间格式化
Vue.filter('dateFormat', (dateValue) => {
  const date = new Date(dateValue);

  const y = date.getFullYear();
  const M = (date.getMonth() + 1 + '').padStart(2, '0');
  const d = (date.getDay() + '').padStart(2, '0');
  const h = (date.getHours() + '').padStart(2, '0');
  const m = (date.getMinutes() + '').padStart(2, '0');
  const s = (date.getSeconds() + '').padStart(2, '0');

  return `${y}-${M}-${d}-${h}-${m}-${s}`;
})

// 导航守卫控制登录权限
router.beforeEach((to, form, next) => {
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
