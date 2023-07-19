import { Contact } from "@/requestTypes/Contact";
import type { ContactCustomField } from "@/requestTypes/ContactCustomField";

export class ContactResponse extends Contact {
	id: number

	constructor(id: number, firstName: string, lastName: string, customFields: ContactCustomField[]) {
		super(firstName, lastName, customFields)
		this.id = id
	}
}

// const x = new ContactResponse(1, 'a', 'a', [])
// x.id = 