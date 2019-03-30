import Vue from 'vue'
import VueRouter from 'vue-router'
// import axios from 'axios'
// import HelloWorld from '@/components/HelloWorld'
// import AppLayout from '@/components/AppLayout'
// import Leave from '@/components/Leave'
// import Work from '@/components/Work'
// import Login from '@/components/Login'
import {getCookie} from '../util/util'
const AppLayout = resolve => require.ensure([], () => resolve(require('@/components/public/AppLayout')));
const Leave = resolve => require.ensure([], () => resolve(require('@/components/Leave')));
const Work = resolve => require.ensure([], () => resolve(require('@/components/Work')));
const Login = resolve => require.ensure([], () => resolve(require('@/components/Login')));
Vue.use(VueRouter)

const router=new VueRouter({
  mode: 'history',
  routes: [  
    {
      path: '/',
      name: '首页',
      component: AppLayout,
      redirect: { name: 'leave' },
      children:[
        {
          path:'leave',
          name:'leave',
          component:Leave,
          meta: { needLogin: true }
        },{
          path:'work',
          name:'work',
          component:Work,
          meta: { needLogin: true }
        }
      ]
    },{
      path: '/login',
      name:'登陆',
      component: Login,     
    },{
      path:'*',  
      component: Login,
    }
  ]
})

export default router

router.beforeEach((to, from, next) => {
  // console.log(to.matched)
  // console.log(to.fullPath)
  //route.matched获取到当前路由所有的路由记录
  //判断路由记录是否需要验证登录  
  if(to.matched.some(current => current.meta.needLogin)){
    /*
    * 自己封装方法判断登录 sessionstorage localstorage cookie啥的自行决定
    */
    var user=getCookie('user');
    if(user == null){
      next({
        path: '/login',
        query: {redirect:to.fullPath}//登录页需要知道从哪跳过来的，方便登录成功后回到原页面
      })
      axios.get('/api/user/delCookie');
    }else {
      next()
    }
  }else {
    next()
  }
});
