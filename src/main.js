import axios from 'axios';
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router'


Vue.config.productionTip = false
axios.defaults.baseURL = process.env.VUE_APP_BACKEND_API_URL

Vue.use(VueRouter)
import Login from "./components/Login.vue"
const routes = [
  {
    path: "/login",
    name: "login",
    component: Login
  }
];
Vue.use(require('vue-moment'));



const router = new VueRouter({
  routes 
})

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
