import { ContactCustomFieldTypes } from "@/enums/ContactCustomFieldTypes"
import type { ContactCustomField } from "@/requestTypes/ContactCustomField"
import BaseReponse from "@/responseTypes/BaseResponse"

import { validators } from '@/validation/validations'

export function fieldTypeValidator(fieldValue: string, field: ContactCustomField): BaseReponse<null> {
	const fieldType = field.fieldType

	if (fieldType === ContactCustomFieldTypes.DATE) {
		const res = validators.date(fieldValue)
		return new BaseReponse(res, 'Invalid date', null)
	}

	else if (fieldType === ContactCustomFieldTypes.EMAIL) {
		const res = validators.email(fieldValue)
		return new BaseReponse(res, 'Invalid email', null)
	}

	else if (fieldType === ContactCustomFieldTypes.PHONE) {
		const res = validators.phone(fieldValue)
		return new BaseReponse(res, 'Invalid phone', null)
	}

	else if (fieldType === ContactCustomFieldTypes.SECRET) {
		return new BaseReponse(true, '', null)
	}

	else if (fieldType === ContactCustomFieldTypes.TEXT) {
		return new BaseReponse(true, '', null)
	}

	else {
		console.log('fieldTypeValidator: error invalid field type')
		return new BaseReponse(false, 'internal error', null)
	}
}