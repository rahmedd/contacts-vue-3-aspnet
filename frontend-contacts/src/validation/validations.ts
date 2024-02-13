function phone(val: string): boolean {
	const re = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
	const res: boolean = re.test(val)
	return res
}

function email(val: string): boolean {
	const re = /\S+@\S+\.\S+/;
	const res: boolean = re.test(val)
	return res
}

function date(val: string): boolean {
	const date = new Date(val)
	const res: boolean = !isNaN(date.getFullYear())
	return res
}

function containsNumber(val: string): boolean {
	const re = /\d/;
	const res: boolean = re.test(val)
	return res
}

function containsUpper(val: string): boolean {
	const re = /[A-Z]/;
	const res: boolean = re.test(val)
	return res
}

function containsLower(val: string): boolean {
	const re = /[a-z]/;
	const res: boolean = re.test(val)
	return res
}

export const validators = {
	phone,
	email,
	date,
	containsNumber,
	containsUpper,
	containsLower,
}