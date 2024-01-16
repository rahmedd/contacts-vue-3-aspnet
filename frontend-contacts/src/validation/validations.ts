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

export const validators = {
	phone,
	email,
	date,
}