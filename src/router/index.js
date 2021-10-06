import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '@/components/home/Home'
import Welcome from '@/components/home/Welcome.vue'
import Users from '@/components/users/Users.vue'
import Rights from '@/components/rights/Rights.vue'
import Roles from '@/components/rights/Roles.vue'
import Cate from '@/components/goods/Cate.vue'
import Params from '@/components/goods/Params.vue'
import GoodsList from '@/components/goods/GoodsList.vue'
import AddGood from '@/components/goods/AddGood.vue'

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
    },
    {
      path: '/rights',
      component: Rights
    },
    {
      path: '/roles',
      component: Roles
    },
    {
      path: '/categories',
      component: Cate
    },
    {
      path: '/params',
      component: Params
    },
    {
      path: '/goods',
      component: GoodsList,
      children: [
      ]
    },
    {
      path: '/goods/add',
      component: AddGood
    }
    ]
  }]
})

export default router
