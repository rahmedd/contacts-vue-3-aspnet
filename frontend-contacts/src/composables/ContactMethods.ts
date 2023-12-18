import axios from '@/services/axios'
import { ref } from 'vue'
import type { ComposeResult } from '@/composables/ComposeResult'
import { ContactResponse } from '@/responseTypes/ContactResponse'
import { ComposeResultState } from '@/enums/ComposeResultState'
import type BaseReponse from '@/responseTypes/BaseResponse'
import type { AxiosResponse } from 'axios'
import { ContactCustomField } from '@/requestTypes/ContactCustomField'

export function useGetContact(): ComposeResult<ContactResponse | null, number> {
	const contact = ref<ContactResponse | null>(null)
	const state = ref<ComposeResultState>(ComposeResultState.LOADING)
	const error = ref<any | null>(null)

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

	return {
		state: state,
		data: contact,
		update: getContact
	}
}

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

export function contactInternalToContact() {
	return
}