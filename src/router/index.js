import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/users'

Vue.use(VueRouter)


const router = new VueRouter({
    routes: [
        {path: '/', redirect: '/login'},
        {path: '/login', component: Login},
        {
            path: '/home',
            component: Home,
            children: [
                { path: '/', redirect: '/welcome'},
                { path: '/welcome', component: Welcome},
                { path: '/users', component: Users}
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {

    if (to.path === '/login') {
        return next()
    }

    //获取token
    const token = window.sessionStorage.getItem('token')
    if (!token) {
        return next('/login')
    }

    next();

})

export default router
