import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '@/components/home/Home'
import Welcome from '@/components/home/Welcome.vue'
import Users from '@/components/users/Users.vue'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    redirect: 'login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    },
    {
      path: '/users',
      component: Users
    }]
  }]
})

export default router
