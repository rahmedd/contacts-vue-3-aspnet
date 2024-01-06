import type { ContactCustomFieldTypes } from "@/enums/ContactCustomFieldTypes"

export class ContactCustomField {
	id?: number
	internalId: string
	fieldName: string
	fieldValue: string
	fieldType: ContactCustomFieldTypes

	constructor(fieldName: string, fieldValue: string, fieldType: ContactCustomFieldTypes) {
		this.internalId = self.crypto.randomUUID()
		this.fieldName = fieldName
		this.fieldType = fieldType
		this.fieldValue = fieldValue
	}
}