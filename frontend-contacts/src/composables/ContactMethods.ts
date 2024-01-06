import axios from '@/services/axios'
import { ref } from 'vue'
import type { ComposeResult } from '@/composables/ComposeResult'
import { Contact } from '@/requestTypes/Contact'
import { ContactResponse } from '@/responseTypes/ContactResponse'
import { ComposeResultState } from '@/enums/ComposeResultState'
import type BaseReponse from '@/responseTypes/BaseResponse'
import type { AxiosResponse } from 'axios'
import { ContactCustomFieldResponse } from "@/responseTypes/ContactCustomFIeldResponse";

export function useGetContact():
ComposeResult<
	ContactResponse | null,
	number,
	void
> {
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

			const res: AxiosResponse<BaseReponse<ContactResponse>> = await axios.put(`Contact`, ct)
			contact.value = contactToContactInternal(res.data.body)

			state.value = ComposeResultState.SUCCESS

			return res.data.body
		}
		catch (ex) {
			console.log(ex)
			state.value = ComposeResultState.FAILURE
		}

		return null
	}

	return {
		state: state,
		data: contact,
		update: update,
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

	async function update(ct: Contact) {
		try {
			state.value = ComposeResultState.LOADING

			const res: AxiosResponse<BaseReponse<ContactResponse>> = await axios.put(`Contact`)
			contact.value = contactToContactInternal(res.data.body)

			state.value = ComposeResultState.SUCCESS

			return res.data.body
		}
		catch (ex) {
			console.log(ex)
			state.value = ComposeResultState.FAILURE
		}

		return null
	}

	return {
		state: state,
		data: contact,
		update: update,
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