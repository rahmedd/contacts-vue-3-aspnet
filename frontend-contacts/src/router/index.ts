import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import ContactView from '@/views/ContactView.vue'
import DemoView from '@/views/DemoView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes:
	[
		{
			path: '/',
			name: 'home',
			component: HomeView
		},
		{
			path: '/login',
			name: 'login',
			component: LoginView,
			meta: {
				requiresAuth: false,
				forVisitors: true
			}
			
		},
		{
			path: '/signup',
			name: 'signup',
			component: SignupView,
			meta: {
				requiresAuth: false
			}
		},
		{
			path: '/demo',
			name: 'demo',
			component: DemoView,
			meta: {
				requiresAuth: true
			}
		},
		{
			path: '/contact',
			name: 'contact',
			component: ContactView,
			meta: {
				requiresAuth: true
			}
		},
		// {
		// 	path: '/about',
		// 	name: 'about',
		// 	// route level code-splitting
		// 	// this generates a separate chunk (About.[hash].js) for this route
		// 	// which is lazy-loaded when the route is visited.
		// 	component: () => import('../views/AboutView.vue')
		// },
		{
			path: '/:pathMatch(.*)*',
			name: 'notfound',
			component: NotFoundView
		},
	]
})

router.beforeEach((to, from, next) => {
	const authStore = useAuthStore()
	const isLoggedin = authStore.loggedIn
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
	const forVisitors = to.matched.some(record => record.meta.forVisitors)

	// prevents authenticated user from going back to login
	if (forVisitors && isLoggedin) {
		next({ path: '/contact' })
	}
	// redirects unauthenticated users to login
	else if (requiresAuth && !isLoggedin) {
		next({ path: '/login' })
	}
	else {
		next()
	}
})

export default router
