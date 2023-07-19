export class ContactCustomField {
	fieldName: string
	fieldValue: string
	fieldType: string

	constructor(fieldName: string, fieldValue: string, fieldType: string) {
		this.fieldName = fieldName
		this.fieldType = fieldType
		this.fieldValue = fieldValue
	}
}