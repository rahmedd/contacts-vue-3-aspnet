import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Contact } from '@/requestTypes/Contact'
import { ContactCustomField } from '@/requestTypes/ContactCustomField'
import { ContactCustomFieldTypes } from '@/enums/ContactCustomFieldTypes'

function getRandomNumber(): number {
	return self.crypto.getRandomValues(new Uint32Array(1))[0]
}

export const useDemoStore = defineStore(
	'demo',
	() => {
		const contacts = ref<Contact[]>([
			new Contact(getRandomNumber(), 'George', 'Washington', [
				new ContactCustomField(
					getRandomNumber(),
					'Home',
					'123-123-1234',
					ContactCustomFieldTypes.PHONE,
				),
			]),

			new Contact(getRandomNumber(), 'John', 'Adams', [
				new ContactCustomField(
					getRandomNumber(),
					'Home',
					'123-123-1234',
					ContactCustomFieldTypes.PHONE,
				),
			]),

			new Contact(getRandomNumber(), 'Thomas', 'Jefferson', [
				new ContactCustomField(
					getRandomNumber(),
					'Home',
					'123-123-1234',
					ContactCustomFieldTypes.PHONE,
				),
			]),
			new Contact(getRandomNumber(), 'James', 'Madison', [
				new ContactCustomField(
					getRandomNumber(),
					'Home',
					'123-123-1234',
					ContactCustomFieldTypes.PHONE,
				),
			]),
			new Contact(getRandomNumber(), 'James', 'Monroe', [
				new ContactCustomField(
					getRandomNumber(),
					'Home',
					'123-123-1234',
					ContactCustomFieldTypes.PHONE,
				),
			]),
		])

		function getContact(id: number) {
			return contacts.value.find(c => c.id === id)
		}

		function getContacts(searchQuery: string = '') {
			const sq = searchQuery.toLowerCase()

			if (searchQuery) {
				return contacts.value.filter(c => {
					const fn = c.firstname.toLowerCase();
					const ln = c.lastname.toLowerCase();
					const ret = (fn + ' ' + ln).startsWith(sq) || (ln + ' ' + fn).startsWith(sq)
					return ret
				})
			}

			return contacts.value
		}

		function updateContact(ct: Contact) {
			const idx = contacts.value.findIndex(c => c.id == ct.id)
			contacts.value[idx] = ct

			return contacts.value[idx]
		}

		function createContact(ct: Contact) {
			ct.id = getRandomNumber()
			contacts.value.push(ct)
			return ct
		}

		function deleteContact(id: number) {
			const idx = contacts.value.findIndex(c => c.id == id)
			if (idx < 0) {
				console.log('demo:deleteContact: contact not found')
				return
			}

			contacts.value.splice(idx, 1)
			return
		}

		return {
			contacts,
			getContact,
			getContacts,
			updateContact,
			createContact,
			deleteContact,
		}
	},
	{
		persist: true
	}
)