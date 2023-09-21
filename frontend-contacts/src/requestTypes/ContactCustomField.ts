import type { ContactCustomFieldTypes } from "@/enums/ContactCustomFieldTypes"

export class ContactCustomField {
	fieldName: string
	fieldValue: string
	fieldType: ContactCustomFieldTypes

	constructor(fieldName: string, fieldValue: string, fieldType: ContactCustomFieldTypes) {
		this.fieldName = fieldName
		this.fieldType = fieldType
		this.fieldValue = fieldValue
	}
}