<script setup lang="ts">
// lib
import { ref, type PropType, onMounted, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/services/axios'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { useCreateContact, useUpdateContact, useDeleteContact } from '@/composables/ContactMethods'

// blooma
import { BloomaSizes } from '@/blooma/enums/BloomaSizes'
import { BloomaTypes } from '@/blooma/enums/BloomaTypes'
import { BloomaValidationModes } from '@/blooma/enums/BloomaValidationModes'

// types
import { Contact } from '@/requestTypes/Contact'
import { ContactResponse } from '@/responseTypes/ContactResponse'
import { ContactCustomField } from '@/requestTypes/ContactCustomField'
import { ContactCustomFieldTypes } from '@/enums/ContactCustomFieldTypes'
import { EditContactModes } from '@/enums/EditContactModes'

// components
import { Icon } from '@iconify/vue'
import BButton from '@/blooma/BButton.vue'
import BInput from '@/blooma/BInput.vue'
import BModal from '@/blooma/BModal.vue'
import BForm from '@/blooma/BForm.vue'
import CustomField from '@/components/CustomField.vue'


const props = defineProps({
	contact: {
		type: Object as PropType<Contact>,
		required: true,
	},
	mode: {
		type: Number as PropType<EditContactModes>,
		required: true,
	},
})

const emits = defineEmits<{
	updateId: [id: number],
	updateMode: [mode: EditContactModes],
	resetForm: [],
	unselect: [],
}>()

const form = reactive(
	new Contact(
		props.contact.id,
		props.contact.firstname,
		props.contact.lastname,
		props.contact.customFields.map(f => new ContactCustomField(f.id, f.fieldName, f.fieldValue, f.fieldType))),
)

//- vuelidate inject subform
const isRequired = helpers.withMessage('Required', required)
const rules = {
	firstname: { isRequired, },
	lastname: { isRequired, },
}
const v$ = useVuelidate(rules, form)

const deleteModal = ref<boolean>(false)

const { action: updateContact } = useUpdateContact()
const { action: createContact } = useCreateContact()
const { action: deleteContact } = useDeleteContact()

// used for new contact selection and delete contact unselect on SelectContact component
function updateContactId(id: number) {
	emits('updateId', id)
}

function updateMode(mode: EditContactModes) {
	emits('updateMode', mode)
}

function editContact() {
	updateMode(EditContactModes.EDIT)
}

function cancelEdit() {
	updateMode(EditContactModes.VIEW)
	emits('resetForm')
}

function unselectContact() {
	updateMode(EditContactModes.VIEW)
	emits('unselect')
}

async function saveContact() {
	const res = await v$.value.$validate()
	if (!res) {
		return
	}
 
	try {
		// creating a new contact
		if (props.contact.id === 0) {
			const createRes = await createContact(form)
			
			// Selected contact can change on creation of new contact or delete contact
			updateContactId(createRes!.id)
		}

		// updating a contact
		else {
			const updateRes = await updateContact(form)
			if (updateRes) {
				// emits('updateContact', updateRes)
			}
		}
	}
	catch (ex) {
		console.log(ex)
		console.log('saveContact error')
	}

	updateMode(EditContactModes.VIEW)
}

async function deleteCt() {
	try {
		const res = await deleteContact(form.id)
		updateContactId(-1)
	}
	catch (ex)
	{
		console.log(ex)
		console.log('deleteContact error')
	}

	deleteModal.value = false
}

function toggleDeleteModal() {
	deleteModal.value = !deleteModal.value
}

function createCustomField(fieldType: ContactCustomFieldTypes) {
	const duplicate = form.customFields.find(f => (f.fieldType === fieldType) && !(f.fieldName || f.fieldValue))
	if (duplicate) {
		return
	}

	form.customFields.push(
		new ContactCustomField(
			0,
			'',
			'',
			fieldType,
		)
	)
}

function updateCustomField(field: ContactCustomField) {
	const idx = form.customFields.findIndex(f => f.internalId === field.internalId)
	if (idx < 0) {
		console.log('updateCustomField: field not found')
		return
	}

	form.customFields[idx].fieldName = field.fieldName
	form.customFields[idx].fieldType = field.fieldType
	form.customFields[idx].fieldValue = field.fieldValue
}

function deleteCustomField(field: ContactCustomField) {
	const idx = form.customFields.findIndex(f => f.internalId === field.internalId)
	if (idx < 0) {
		console.log('deleteCustomField: field not found')
		return
	}

	form.customFields.splice(idx, 1)
}

const customFields = computed(() => 
	form.customFields.filter(f => 
		// Does not include
		![
			ContactCustomFieldTypes.EMAIL,
			ContactCustomFieldTypes.PHONE,
		].includes(f.fieldType)
	)
)
const emailFields = computed(() => form.customFields.filter(f => f.fieldType === ContactCustomFieldTypes.EMAIL))
const phoneFields = computed(() => form.customFields.filter(f => f.fieldType === ContactCustomFieldTypes.PHONE))

// document.body.requestFullscreen() // It works, but I don't like how annoying it is.
</script>

<template lang="pug">
div.edit-contact-container
	BForm.contact-form(v-if="mode === EditContactModes.EDIT" @input="editContact" :loading="false")
		div.row.label &nbsp;
		div.row
			h1.title.is-4 Name
		div.row-split
			BInput(placeholder='First name' name='firstname' v-model='form.firstname' :mode="BloomaValidationModes.Aggressive" :val$="v$.firstname" :debounce="250")
			BInput(placeholder='Last name' name='lastname' v-model='form.lastname' :mode="BloomaValidationModes.Aggressive" :val$="v$.lastname" :debounce="250")

		hr
		div.row
			h1.title.is-4 Phone
		div.row-split(v-for="field in phoneFields" :key="field.internalId")
			//- vuelidate subform
			CustomField(:field="field" @update="updateCustomField" @delete="deleteCustomField" :simple="true")
		div.row
			BButton.add-field(:type="BloomaTypes.Primary" :light="true" @click="() => createCustomField(ContactCustomFieldTypes.PHONE)")
				b New phone
				Icon(icon="ci:add-row" height="24")

		hr
		div.row
			h1.title.is-4 Email
		div.row-split(v-for="field in emailFields" :key="field.internalId")
			CustomField(:field="field" @update="updateCustomField" @delete="deleteCustomField" :simple="true")
		div.row
			BButton.add-field(:type="BloomaTypes.Primary" :light="true" @click="() => createCustomField(ContactCustomFieldTypes.EMAIL)")
				b New email
				Icon(icon="ci:add-row" height="24")

		hr
		div.row
			h1.title.is-4 Custom fields
		div.row-split(v-for="field in customFields" :key="field.internalId")
			CustomField(:field="field" @update="updateCustomField" @delete="deleteCustomField")

		div.row-split
			BButton.add-field(:type="BloomaTypes.Primary" :light="true" @click="() => createCustomField(ContactCustomFieldTypes.TEXT)")
				b New custom field
				Icon(icon="ci:add-row" height="24")

	div.contact-form(v-else)
		div.row.label &nbsp;
		div.row
			h1.title.is-4 {{ form.firstname }} {{ form.lastname }}
		hr

		template(v-if="phoneFields.length > 0")
			div.row
				h1.title.is-5 Phone
			div(v-for="field in phoneFields")
				div.row.label {{ field.fieldName }}
				div.row
					h1.title.is-5 {{ field.fieldValue }}
			hr

		template(v-if="emailFields.length > 0")
			div.row
				h1.title.is-5 Email
			div(v-for="field in emailFields")
				div.row.label {{ field.fieldName }}
				div.row
					h1.title.is-5 {{ field.fieldValue }}
			hr

		template(v-if="customFields.length > 0")
			div.row
				h1.title.is-5 Custom fields
			div(v-for="field in customFields")
				div.row.label {{ field.fieldName }}
				div.row
					h1.title.is-5 {{ field.fieldValue }}
			hr

	div.button-bar
		.button-bar-left
			BButton(v-if="mode === EditContactModes.EDIT" :type="BloomaTypes.Primary" @click="saveContact") Save
			BButton(v-else :type="BloomaTypes.Primary" @click="editContact") Edit
			BButton(v-if="mode === EditContactModes.EDIT" :type="BloomaTypes.Default" @click="cancelEdit") Cancel
			BButton(v-else :type="BloomaTypes.Default" @click="unselectContact") Back
		.button-bar-right
			BButton(v-if="mode === EditContactModes.VIEW && props.contact.id !== 0" :type="BloomaTypes.Danger" @click="toggleDeleteModal")
				span.icon
					Icon(icon="mdi:trash" height="22")
				BModal(v-if="deleteModal")
					template(v-slot:header)
						p.modal-card-title Delete {{ form.firstname }}?
					template(v-slot:content)
						span Are you sure you want to delete {{ form.firstname }}'s contact?
					template(v-slot:footer)
						BButton(:type="BloomaTypes.Danger" @click="deleteCt") Delete
						BButton(:type="BloomaTypes.Default" @click="toggleDeleteModal") Cancel
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints

$gap: 20px;
.edit-contact-container {
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 1fr auto;
	gap: 0px 0px; 
	grid-template-areas: 
		"."
		".";
	height: 100%;
}

.row-split {
	display: flex;

	.row-button {
		width: 100%
	}

	margin-left: $gap;
	margin-right: $gap;
	// margin-bottom: $gap;
}

.row {
	margin-left: $gap;
	margin-right: $gap;
	margin-bottom: $gap;
}

.field {
	max-width: 250px;
}
.field:not(:last-child) {
	margin-right: 10px;
}
.add-field {
	b {
		margin-right: 8px;
	}
}

// .field-stack {
// 	display: flex;
// 	flex-direction: column;

// 	.field {
// 		height: 50px;
// 		margin: 0;
// 	}
// }

.label {
	font-size: 0.9rem;
	font-weight: 500;
	margin-bottom: 4px;
	color: #03363e;
}

.button-bar {
	display: flex;
	justify-content: space-between;
	padding: $gap $gap;
	background: $bl-primary-light;
}

.button-bar-left > * {
	margin-right: $gap;
}

#container::backdrop {
    background-color: #ffffff00;
}

@media screen and (max-width: $tablet) {
	$gap: 10px;
	.row-split {
		margin-left: $gap;
		margin-right: $gap;
	}

	.row {
		margin-left: $gap;
		margin-right: $gap;
		margin-bottom: $gap;
	}

	.modal-card{
		height: 100vh;
	}
}
</style>