export default class LoginRequest {
	public username: string
	public password: string
	public confirmPassword: string

	constructor(usename: string, password: string, confirmPassword: string) {
		this.username = usename
		this.password = password
		this.confirmPassword = confirmPassword
	}
}