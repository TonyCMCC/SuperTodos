// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'

Vue.config.productionTip = false

Vue.use(MintUI)

let vm = new Vue({
	el: '#app',
	router,
	template:'<App/>',
	components:{ App }
})

Vue.use({
	vm
})