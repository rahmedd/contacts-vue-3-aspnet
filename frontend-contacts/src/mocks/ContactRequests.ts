import type { Contact } from '@/requestTypes/Contact'
import { useDemoStore } from '@/stores/demo'

export function getContacts(searchQuery: string = '') {
	const store = useDemoStore()
	const contacts = store.getContacts(searchQuery)

	return contacts
}

export function getContact(id: number) {
	const store = useDemoStore()
	const contact = store.getContact(id)

	return contact	
}

export function updateContact(ct: Contact) {
	const store = useDemoStore()
	const contact = store.updateContact(ct)

	return contact
}

export function createContact(ct: Contact) {
	const store = useDemoStore()
	const contact = store.createContact(ct)

	return contact
}

export function deleteContact(id: number) {
	const store = useDemoStore()
	const contact = store.deleteContact(id)

	return contact
}