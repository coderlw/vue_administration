import Vue from 'vue'
import axios from 'axios'

function request() {
    // 配置请求的根路径
    axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
    axios.interceptors.request.use(config => {
        // console.log(config);
        config.headers.Authorization = window.sessionStorage.getItem('token');
        return config;
    })
    Vue.prototype.$axios = axios;
}

export default request