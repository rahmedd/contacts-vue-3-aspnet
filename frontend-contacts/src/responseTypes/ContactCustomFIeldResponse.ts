import type { ContactCustomFieldTypes } from "@/enums/ContactCustomFieldTypes"
import { ContactCustomField } from "@/requestTypes/ContactCustomField"

export class ContactCustomFieldResponse extends ContactCustomField {
	id: number

	constructor(id: number, fieldName: string, fieldValue: string, fieldType: ContactCustomFieldTypes) {
		super(fieldName, fieldValue, fieldType)
		this.id = id
	}
}	