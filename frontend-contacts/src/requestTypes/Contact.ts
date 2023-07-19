import type { ContactCustomField } from '@/requestTypes/ContactCustomField';

export class Contact {
	public firstName: string
	public lastName: string
	public customFields: ContactCustomField[]
	
	constructor(firstName: string, lastName: string, customFields: ContactCustomField[]) {
		this.firstName = firstName
		this.lastName = lastName
		this.customFields = customFields
	}
}