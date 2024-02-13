import { ref } from 'vue'
import { defineStore } from 'pinia'
import type User from '@/responseTypes/User'

export const useAuthStore = defineStore(
	'settings',
	() => {
		const isDarkMode = ref(false)
		const isFullscreen = ref(false)

		function setFullscreen(on: boolean) {
			isFullscreen.value = on
		}

		return { isDarkMode, isFullscreen, setFullscreen }
	},
	{
		persist: true
	}
)