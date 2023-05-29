import axios, { type AxiosInstance } from 'axios'

const apiClient: AxiosInstance = axios.create({
	baseURL: '/api',
	// headers: {
	// 	"Content-Type": "application/json",
	// },
})

export default apiClient;