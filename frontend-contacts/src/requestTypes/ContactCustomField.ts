import type { ContactCustomFieldTypes } from "@/enums/ContactCustomFieldTypes"

export class ContactCustomField {
	internalId: string
	fieldName: string
	fieldValue: string
	fieldType: ContactCustomFieldTypes

	constructor(fieldName: string, fieldValue: string, fieldType: ContactCustomFieldTypes) {
		this.fieldName = fieldName
		this.fieldType = fieldType
		this.fieldValue = fieldValue
		this.internalId = self.crypto.randomUUID()
	}
}