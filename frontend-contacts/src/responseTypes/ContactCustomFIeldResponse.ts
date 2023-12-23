import type { ContactCustomFieldTypes } from "@/enums/ContactCustomFieldTypes"
import { ContactCustomField } from "@/requestTypes/ContactCustomField"

export class ContactCustomFieldResponse implements ContactCustomField {
	internalId: string
	fieldName: string
	fieldValue: string
	fieldType: ContactCustomFieldTypes
	id: number

	constructor(id: number, fieldName: string, fieldValue: string, fieldType: ContactCustomFieldTypes) {
		this.internalId = self.crypto.randomUUID()
		this.fieldName = fieldName
		this.fieldType = fieldType
		this.fieldValue = fieldValue
		this.id = id
	}
}	