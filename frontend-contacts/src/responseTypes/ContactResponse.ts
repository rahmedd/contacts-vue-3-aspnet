import { Contact } from "@/requestTypes/Contact";
import type { ContactCustomField } from "@/requestTypes/ContactCustomField";

export class ContactResponse extends Contact {
	id: number

	constructor(id: number, firstname: string, lastname: string, customFields: ContactCustomField[]) {
		super(firstname, lastname, customFields)
		this.id = id
	}
}

// const x = new ContactResponse(1, 'a', 'a', [])
// x.id = 