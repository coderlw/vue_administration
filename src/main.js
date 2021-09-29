import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import { message } from 'element-ui'
// 引入全局样式
import './assets/css/global.css'
// 引入字体图标
import './assets/fonts/iconfont.css'
// 引入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
Vue.prototype.$axios = axios;
Vue.prototype.$message = message;

Vue.use(ElementUI)
Vue.config.productionTip = false
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
