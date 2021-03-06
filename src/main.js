import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/basis.css'
import './assets/css/tag.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

import axios from 'axios'
Vue.prototype.$http = axios;
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
