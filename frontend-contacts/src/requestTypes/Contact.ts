import type { ContactCustomField } from '@/requestTypes/ContactCustomField';

export class Contact {
	public id?: number
	public firstname: string
	public lastname: string
	public customFields: ContactCustomField[]
	
	constructor(id: number, firstname: string, lastname: string, customFields: ContactCustomField[]) {
		this.id = id
		this.firstname = firstname
		this.lastname = lastname
		this.customFields = customFields
	}
}