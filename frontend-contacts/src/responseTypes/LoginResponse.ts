export default class LoginResponse {
	id: number
	username: string

	constructor(id: number, username: string) {
		this.id = id
		this.username = username
	}
}