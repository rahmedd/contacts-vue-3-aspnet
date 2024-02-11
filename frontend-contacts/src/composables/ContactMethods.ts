import { ref } from 'vue'
import apiClient from '@/services/axios'

import type { ComposeResult } from '@/composables/ComposeResult'
import type { AxiosResponse } from 'axios'
import { ContactResponse } from '@/responseTypes/ContactResponse'
import type BaseReponse from '@/responseTypes/BaseResponse'
import { ContactCustomFieldResponse } from "@/responseTypes/ContactCustomFIeldResponse";
import { Contact } from '@/requestTypes/Contact'
import { ComposeResultState } from '@/enums/ComposeResultState'

export function useGetContacts():
ComposeResult<
	Contact[],
	string,
	void
> {
	const contact = ref<Contact[]>([])
	const state = ref<ComposeResultState>(ComposeResultState.LOADING)
	const error = ref<any | null>(null)

	async function getContacts(searchQuery: string = '') {
		try {
			state.value = ComposeResultState.LOADING

			const res: AxiosResponse<BaseReponse<Contact[]>> = await apiClient.get(`Contact`, {
				params: {
					searchQuery: searchQuery?.trim()
				}
			})

			contact.value = res.data.body

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
		try {
			state.value = ComposeResultState.LOADING

			const res: AxiosResponse<BaseReponse<Contact>> = await apiClient.get(`Contact/${id}`)
			contact.value = res.data.body

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

	async function update(ct: Contact) {
		try {
			state.value = ComposeResultState.LOADING

			const res: AxiosResponse<BaseReponse<ContactResponse>> = await apiClient.put(`Contact`, ct)
			contact.value = contactToContactInternal(res.data.body)

			state.value = ComposeResultState.SUCCESS

			return res.data.body
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
		try {
			state.value = ComposeResultState.LOADING

			const res: AxiosResponse<BaseReponse<ContactResponse>> = await apiClient.post(`Contact`, ct)
			contact.value = contactToContactInternal(res.data.body)

			state.value = ComposeResultState.SUCCESS

			return res.data.body
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
		try {
			state.value = ComposeResultState.LOADING

			const res: AxiosResponse<BaseReponse<null>> = await apiClient.delete(`Contact/${id}`)
			// contact.value = res.data.body

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