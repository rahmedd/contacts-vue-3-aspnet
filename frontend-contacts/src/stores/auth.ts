import { ref } from 'vue'
import { defineStore } from 'pinia'
import type User from '@/responseTypes/User'

export const useAuthStore = defineStore(
	'auth',
	() => {
		const demoMode = ref(false)
		const loggedIn = ref(false)
		const user = ref<User | null>(null)

		function login(_loggedIn: boolean, _user: User) {
			demoMode.value = false
			loggedIn.value = _loggedIn
			user.value = _user
		}

		function setDemo(val: boolean) {
			demoMode.value = val
		}

		return {
			demoMode,
			loggedIn,
			user,
			login,
			setDemo,
		}
	},
	{
		persist: true
	}
)