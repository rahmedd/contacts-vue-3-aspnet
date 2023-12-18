import axios from '@/services/axios'
import { ref } from 'vue'
import type { ComposeResult } from '@/composables/ComposeResult'
import { ContactResponse } from '@/responseTypes/ContactResponse'
import { ComposeResultState } from '@/enums/ComposeResultState'
import type BaseReponse from '@/responseTypes/BaseResponse'
import type { AxiosResponse } from 'axios'
import { ContactCustomField } from '@/requestTypes/ContactCustomField'
import type { Contact } from '@/requestTypes/Contact'

export function useContact():
ComposeResult<
	ContactResponse | null,
	ContactResponse,
	number,
	ContactResponse,
	number
> {
	const contact = ref<ContactResponse | null>(null)
	const state = ref<ComposeResultState>(ComposeResultState.LOADING)
	const error = ref<any | null>(null)

	async function createContact(ct: ContactResponse) {
		// convert ContactResponse to ContactRequest
		try {
			state.value = ComposeResultState.LOADING

			// const res: AxiosResponse<BaseReponse<ContactResponse>> = await axios.put(`Contact`, ct)
			// contact.value = contactToContactInternal(res.data.body)

			state.value = ComposeResultState.SUCCESS
		}
		catch (ex) {
			console.log(ex)
			state.value = ComposeResultState.FAILURE
		}
	}

	async function getContact(id: number) {
		try {
			state.value = ComposeResultState.LOADING

			const res: AxiosResponse<BaseReponse<ContactResponse>> = await axios.get(`Contact/${id}`)
			contact.value = contactToContactInternal(res.data.body)

			state.value = ComposeResultState.SUCCESS
		}
		catch (ex) {
			console.log(ex)
			state.value = ComposeResultState.FAILURE
		}
	}

	async function updateContact(ct: ContactResponse) {
		// convert ContactResponse to ContactRequest
		try {
			state.value = ComposeResultState.LOADING

			const res: AxiosResponse<BaseReponse<ContactResponse>> = await axios.put(`Contact`, ct)
			contact.value = contactToContactInternal(res.data.body)

			state.value = ComposeResultState.SUCCESS
		}
		catch (ex) {
			console.log(ex)
			state.value = ComposeResultState.FAILURE
		}
	}

	async function removeContact(id: number) {
		// convert ContactResponse to ContactRequest
		try {
			state.value = ComposeResultState.LOADING

			// const res: AxiosResponse<BaseReponse<ContactResponse>> = await axios.put(`Contact`, ct)
			// contact.value = contactToContactInternal(res.data.body)

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
		create: createContact,
		get: getContact,
		update: updateContact,
		remove: removeContact,
	}
}

// export function useUpdateContact(): ComposeResult<ContactResponse | null, [number, ContactResponse]> {
// 	const contact = ref<ContactResponse | null>(null)
// 	const state = ref<ComposeResultState>(ComposeResultState.LOADING)
// 	const error = ref<any | null>(null)

// 	async function updateContact([id, ct]: [number, ContactResponse]) {
// 		// convert ContactResponse to ContactRequest
// 		try {
// 			state.value = ComposeResultState.LOADING

// 			const res: AxiosResponse<BaseReponse<ContactResponse>> = await axios.put(`Contact`, ct)
// 			contact.value = contactToContactInternal(res.data.body)

// 			state.value = ComposeResultState.SUCCESS
// 		}
// 		catch (ex) {
// 			console.log(ex)
// 			state.value = ComposeResultState.FAILURE
// 		}
// 	}

// 	return {
// 		state: state,
// 		data: contact,
// 		update: updateContact
// 	}
// }

// adds internal id used for tracking custom fields in vee-validate
export function contactToContactInternal(contact: ContactResponse): ContactResponse {
	const c = new ContactResponse(
		contact.id,
		contact.firstname,
		contact.lastname,
		contact.customFields.map(c => new ContactCustomField(c.fieldName, c.fieldValue, c.fieldType)),
	)

	return c
}

// export function contactInternalToContact(contact: ContactResponse): Contact {
// 	return
// }