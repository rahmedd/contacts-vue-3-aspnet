import type { ContactCustomFieldTypes } from "@/enums/ContactCustomFieldTypes"

export class ContactCustomField {
	id: number
	internalId: string
	fieldName: string
	fieldValue: string
	fieldType: ContactCustomFieldTypes

	constructor(id: number, fieldName: string, fieldValue: string, fieldType: ContactCustomFieldTypes) {
		this.internalId = self.crypto.randomUUID()
		this.id = id
		this.fieldName = fieldName
		this.fieldType = fieldType
		this.fieldValue = fieldValue
	}
}