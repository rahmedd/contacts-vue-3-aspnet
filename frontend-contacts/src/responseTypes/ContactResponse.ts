import { Contact } from "@/requestTypes/Contact";
import { ContactCustomFieldResponse } from "@/responseTypes/ContactCustomFIeldResponse";

export class ContactResponse implements Contact {
	id: number
	firstname: string
	lastname: string
	customFields: ContactCustomFieldResponse[]

	constructor(id: number, firstname: string, lastname: string, customFields: ContactCustomFieldResponse[]) {
		this.firstname = firstname
		this.lastname = lastname
		this.customFields = customFields
		this.id = id
	}
}