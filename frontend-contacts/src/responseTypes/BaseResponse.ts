export default class BaseReponse<T> {
	public readonly success: boolean
	public readonly message: string
	public readonly body: T

	constructor(success: boolean, message: string, body: T) {
		this.success = success
		this.message = message
		this.body = body
	}
}