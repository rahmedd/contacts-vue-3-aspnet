export function customValidatorBase(
	fn: (...fargs: any[]) => any,
	...cargs: any[]
) {
	return {
		$async: true,
		// the trick
		$message: ({ $response }: { $response: { $valid: boolean, yourErrorMessage: boolean } }) => {
			return $response?.yourErrorMessage ?? 'default error message'
		},
		$validator: async (value: string, ...args: any[]) => {
			if (value === '')
				return true;

			const response = await fn(value, ...args)

			return {
				$valid: response.success,
				yourErrorMessage: response.message,
			}
		},
	}
}