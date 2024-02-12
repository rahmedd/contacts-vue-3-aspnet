import hexoid from 'hexoid';
import type { ContactCustomFieldTypes } from "@/enums/ContactCustomFieldTypes"

export class ContactCustomField {
	id: number
	internalId: string
	fieldName: string
	fieldValue: string
	fieldType: ContactCustomFieldTypes

	constructor(id: number, fieldName: string, fieldValue: string, fieldType: ContactCustomFieldTypes) {
		this.internalId = hexoid(32)()
		this.id = id
		this.fieldName = fieldName
		this.fieldType = fieldType
		this.fieldValue = fieldValue
	}
}