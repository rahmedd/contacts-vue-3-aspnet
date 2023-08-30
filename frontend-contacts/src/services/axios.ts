import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth'

const apiClient: AxiosInstance = axios.create({
	baseURL: '/api',
	// headers: {
	// 	"Content-Type": "application/json",
	// },
})

apiClient.interceptors.response.use(
	function (response) {
		return response;
	},
	function (error) {
		const authStore = useAuthStore()
		if (error.response.status === 401) {
			try {
				authStore.$patch({ loggedIn: false })
			}
			catch (ex) {
				console.log(ex)
			}
		}
		return Promise.reject(error);
	}
);


export default apiClient;