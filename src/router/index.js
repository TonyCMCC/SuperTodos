import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: 'all',
      name: '全部'
    },
    {
    	path: 'active',
    	name: '活动中'
    },
    {
    	path: 'completed',
    	name: '已完成'
    },
    {path: '/',redirect: '/active' }
  ]
})
