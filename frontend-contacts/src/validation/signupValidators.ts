import BaseReponse from "@/responseTypes/BaseResponse"
import { validators } from '@/validation/validations'

export function containsNumber(val: string): BaseReponse<null> {
	const res = validators.containsNumber(val)
	if (res) {
		return new BaseReponse(res, '', null)
	}
	else {
		return new BaseReponse(res, 'Password must contain at least 1 number', null)
	}
}

export function containsUpper(val: string): BaseReponse<null> {
	const res = validators.containsUpper(val)
	if (res) {
		return new BaseReponse(res, '', null)
	}
	else {
		return new BaseReponse(res, 'Password must contain at least 1 uppercase character', null)
	}
}

export function containsLower(val: string): BaseReponse<null> {
	const res = validators.containsLower(val)
	if (res) {
		return new BaseReponse(res, '', null)
	}
	else {
		return new BaseReponse(res, 'Password must contain at least 1 lowercase character', null)
	}
}