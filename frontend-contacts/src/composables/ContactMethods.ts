import { ref } from 'vue'
import apiClient from '@/services/axios'

import type { ComposeResult } from '@/composables/ComposeResult'
import type { AxiosResponse } from 'axios'
import { ContactResponse } from '@/responseTypes/ContactResponse'
import type BaseReponse from '@/responseTypes/BaseResponse'
import { ContactCustomFieldResponse } from "@/responseTypes/ContactCustomFIeldResponse";
import { Contact } from '@/requestTypes/Contact'
import { ComposeResultState } from '@/enums/ComposeResultState'
import { useAuthStore } from '@/stores/auth'
import {
	getContacts as mockGetContacts,
	getContact as mockGetContact,
	updateContact as mockUpdateContact,
	createContact as mockCreateContact,
	deleteContact as mockDeleteContact,
} from '@/mocks/ContactRequests'

export function useGetContacts():
ComposeResult<
	Contact[],
	string,
	void
> {
	const contacts = ref<Contact[]>([])
	const state = ref<ComposeResultState>(ComposeResultState.LOADING)
	const error = ref<any | null>(null)

	async function getContacts(searchQuery: string = '') {
		const auth = useAuthStore()

		try {
			state.value = ComposeResultState.LOADING
			let ret: Contact[] = []

			if (auth.demoMode) {
				ret = mockGetContacts(searchQuery)
			}
			else {
				const axiosRes: AxiosResponse<BaseReponse<Contact[]>> = await apiClient.get(`Contact`, {
					params: {
						searchQuery: searchQuery?.trim()
					}
				})

				ret = axiosRes.data.body
			}

			contacts.value = ret

			state.value = ComposeResultState.SUCCESS
		}
		catch (ex) {
			console.log(ex)
			state.value = ComposeResultState.FAILURE
		}
	}

	return {
		state: state,
		data: contacts,
		action: getContacts,
	}
}

export function useGetContact():
ComposeResult<
	Contact | null,
	number,
	void
> {
	const contact = ref<Contact | null>(null)
	const state = ref<ComposeResultState>(ComposeResultState.LOADING)
	const error = ref<any | null>(null)

	async function getContact(id: number) {
		const auth = useAuthStore()
		let ret: Contact | null = null

		try {
			state.value = ComposeResultState.LOADING
			
			if (auth.demoMode) {
				const res = mockGetContact(id)
				if (res) {
					ret = res
				}
			}
			else {
				const res: AxiosResponse<BaseReponse<Contact>> = await apiClient.get(`Contact/${id}`)
				ret = res.data.body
			}

			contact.value = ret

			state.value = ComposeResultState.SUCCESS
		}
		catch (ex) {
			console.log(ex)
			state.value = ComposeResultState.FAILURE
		}
	}

	return {
		state: state,
		data: contact,
		action: getContact
	}
}

export function useUpdateContact():
ComposeResult<
	Contact | null,
	Contact,
	Contact | null
> {
	const contact = ref<Contact | null>(null)
	const state = ref<ComposeResultState>(ComposeResultState.LOADING)
	const error = ref<any | null>(null)

	async function update(updatedCt: Contact) {
		const auth = useAuthStore()
		let ret: Contact | null = null

		try {
			state.value = ComposeResultState.LOADING

			if (auth.demoMode) {
				ret = mockUpdateContact(updatedCt)
			}
			else {
				const res: AxiosResponse<BaseReponse<ContactResponse>> = await apiClient.put(`Contact`, updatedCt)
				ret = res.data.body
			}
			
			if (ret) {
				contact.value = contactToContactInternal(ret)
			}
			else {
				console.log('update contact error')
			}

			state.value = ComposeResultState.SUCCESS
			return ret
		}
		catch (ex) {
			console.log(ex)
			state.value = ComposeResultState.FAILURE
			throw ex
		}
	}

	return {
		state: state,
		data: contact,
		action: update,
	}
}

export function useCreateContact():
ComposeResult<
	Contact | null,
	Contact,
	Contact | null
> {
	const contact = ref<Contact | null>(null)
	const state = ref<ComposeResultState>(ComposeResultState.LOADING)
	const error = ref<any | null>(null)

	async function create(ct: Contact) {
		const auth = useAuthStore()
		let ret: Contact | null = null

		try {
			state.value = ComposeResultState.LOADING

			if (auth.demoMode) {
				ret = mockCreateContact(ct)
			}
			else {
				const res: AxiosResponse<BaseReponse<ContactResponse>> = await apiClient.post(`Contact`, ct)
				ret = res.data.body	
			}

			contact.value = contactToContactInternal(ret)

			state.value = ComposeResultState.SUCCESS
			return ret
		}
		catch (ex) {
			console.log(ex)
			state.value = ComposeResultState.FAILURE
			throw ex
		}
	}

	return {
		state: state,
		data: contact,
		action: create,
	}
}

export function useDeleteContact():
	ComposeResult<
		null,
		number,
		void
	> {
	const contact = ref<null>(null)
	const state = ref<ComposeResultState>(ComposeResultState.LOADING)
	const error = ref<any | null>(null)

	async function deleteContact(id: number) {
		const auth = useAuthStore()

		try {
			state.value = ComposeResultState.LOADING

			if (auth.demoMode) {
				const res = mockDeleteContact(id)
			}
			else {
				const res: AxiosResponse<BaseReponse<null>> = await apiClient.delete(`Contact/${id}`)
			}

			state.value = ComposeResultState.SUCCESS
		}
		catch (ex) {
			console.log(ex)
			state.value = ComposeResultState.FAILURE
		}
	}

	return {
		state: state,
		data: contact,
		action: deleteContact
	}
}

// adds internal id used for tracking custom fields in vee-validate
export function contactToContactInternal(ct: ContactResponse): ContactResponse {
	const contact = new ContactResponse(
		ct.id,
		ct.firstname,
		ct.lastname,
		ct.customFields.map(c => new ContactCustomFieldResponse(c.id, c.fieldName, c.fieldValue, c.fieldType)),
	)

	return contact
}

export function contactInternalToContact() {
	return
}