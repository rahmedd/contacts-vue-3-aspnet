import { ref } from 'vue'
import { defineStore } from 'pinia'
import type User from '@/responseTypes/User'

export const useAuthStore = defineStore(
	'auth',
	() => {
		const loggedIn = ref(false)
		const user = ref<User | null>(null)

		function login(_loggedIn: boolean, _user: User) {
			loggedIn.value = _loggedIn
			user.value = _user
		}

		return { loggedIn, user, login }
	},
	{
		persist: true
	}
)