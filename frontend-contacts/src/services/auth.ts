import apiClient from "@/services/axios";

class Auth {
	login(username: string, password: string) {
		const res = apiClient
			.post("/auth/login", {
				username,
				password
			})
			.then((response: any) => {
				console.log('success login')
				if (response.data.accessToken) {
					// TokenService.setUser(response.data);
				}

				return response.data;
			});
		
		return res
	}

	logout() {
		// TokenService.removeUser();
	}

	// register({ username, email, password }) {
	// 	return api.post("/auth/signup", {
	// 		username,
	// 		email,
	// 		password
	// 	});
	// }
}

export default new Auth();
