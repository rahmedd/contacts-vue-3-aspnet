import hexoid from 'hexoid';
import type { ContactCustomFieldTypes } from "@/enums/ContactCustomFieldTypes"
import { ContactCustomField } from "@/requestTypes/ContactCustomField"

export class ContactCustomFieldResponse implements ContactCustomField {
	id: number
	internalId: string
	fieldName: string
	fieldValue: string
	fieldType: ContactCustomFieldTypes

	constructor(id: number, fieldName: string, fieldValue: string, fieldType: ContactCustomFieldTypes) {
		this.id = id
		this.internalId = hexoid(32)()
		this.fieldName = fieldName
		this.fieldType = fieldType
		this.fieldValue = fieldValue
	}
}	