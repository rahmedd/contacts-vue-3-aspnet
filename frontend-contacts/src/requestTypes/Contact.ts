import type { ContactCustomField } from '@/requestTypes/ContactCustomField';

export class Contact {
	public firstname: string
	public lastname: string
	public customFields: ContactCustomField[]
	
	constructor(firstname: string, lastname: string, customFields: ContactCustomField[]) {
		this.firstname = firstname
		this.lastname = lastname
		this.customFields = customFields
	}
}