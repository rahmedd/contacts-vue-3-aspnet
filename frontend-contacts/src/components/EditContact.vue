<script setup lang="ts">
import { ref, type PropType, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth'
import { useAxios } from '@vueuse/integrations/useAxios'
import { BloomaTypes } from '@/blooma/enums/BloomaTypes'
import { BloomaValidationModes } from '@/blooma/enums/BloomaValidationModes'
import { Contact } from '@/requestTypes/Contact'
import { ContactResponse } from '@/responseTypes/ContactResponse';
import type BaseReponse from '@/responseTypes/BaseResponse';
import type User from '@/responseTypes/User';
import { EditContactModes } from '@/enums/EditContactModes'
import apiClient from '@/services/axios';
import { Icon } from '@iconify/vue';
import BButton from '@/blooma/BButton.vue'
import BInput from '@/blooma/BInput.vue'
import BModal from '@/blooma/BModal.vue';
import BForm from '@/blooma/BForm.vue';
import { BloomaSizes } from '@/blooma/enums/BloomaSizes';
import type { ContactCustomField } from '@/requestTypes/ContactCustomField';

const props = defineProps({
	contact: {
		type: Object as PropType<ContactResponse>,
		required: true,
	},
})

const emits = defineEmits<{
	update: [id: number],
	mode: [mode: EditContactModes],
}>()


const formValue = ref<Contact>(
	new Contact(props.contact.firstname, props.contact.lastname, props.contact.customFields.map(f => { return { ...f } } ))
)

const mode = ref<EditContactModes>(EditContactModes.VIEW)
const deleteModal = ref<boolean>(false)

function selectContact(id: number) {
	emits('update', id)
}

async function saveContact() {
	mode.value = EditContactModes.VIEW
}

async function deleteContact(id: number) {
	// action
	deleteModal.value = false
	return
}

function edited() {
	mode.value = EditContactModes.EDIT
	emits('mode', mode.value)
}

function toggleDeleteModal() {
	deleteModal.value = !deleteModal.value
}

async function DEV_VALIDATE() {
	const res = await validate()
	console.log(res)
}

function log(str: string) {
	console.log(str)
}

onMounted(() => {
	emits('mode', mode.value)
})
</script>

<template lang="pug">
div.edit-contact-container
	BForm.contact-form(@input="edited" :loading="false")
		div.row-split
			BInput(placeholder='First name' name='firstname' v-model='formValue.firstname' :mode="BloomaValidationModes.Aggressive" :debounce="250")
			BInput(placeholder='Last name' name='lastname' v-model='formValue.lastname' :mode="BloomaValidationModes.Aggressive" :debounce="250")
		//- div.row-split(v-for="field in formValue.customFields")
			p {{ field }}
			div.field-stack
				BInput(:placeholder="field.fieldName" :name="field.internalId + `fieldname`" v-model="field.fieldName" :mode="BloomaValidationModes.Aggressive" :debounce="250" :showLabel="false" :size="BloomaSizes.Small")
				BInput(:placeholder="field.fieldName" :name="field.internalId + `fieldvalue`" v-model="field.fieldValue" :mode="BloomaValidationModes.Aggressive" :debounce="250" :showLabel="false")
			div.field-stack
				p hello

		div.row-split
			BButton.row-button(:type="BloomaTypes.Primary" :light="true" @click="deleteContact")
				//- span Add Field
				Icon(icon="typcn:plus" height="22")

	div.button-bar
		BButton(:type="BloomaTypes.Primary" @click="saveContact" :disabled="mode === EditContactModes.VIEW") Save
		BButton(:type="BloomaTypes.Primary" @click="DEV_VALIDATE") Save
		BButton(:type="BloomaTypes.Danger" @click="toggleDeleteModal")
			span.icon
				Icon(icon="mdi:trash" height="22")
				BModal(v-if="deleteModal")
					template(v-slot:header)
						p.modal-card-title Delete
					template(v-slot:content)
						span Are you sure you want to delete {{ props.contact.firstname }}'s contact?
					template(v-slot:footer)
						BButton(:type="BloomaTypes.Danger" @click="deleteContact") Delete
						BButton(:type="BloomaTypes.Default" @click="toggleDeleteModal") Cancel
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints

$gap: 15px;
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
}

.field {
	width: 50%;
}
.field:not(:last-child) {
	margin-right: 10px;
}

.field-stack {
	display: flex;
	flex-direction: column;

	.field {
		height: 50px;
		margin: 0;
	}
}

.button-bar {
	display: flex;
	justify-content: space-between;
	padding: $gap $gap;
	background: $bl-primary-light;
}

@media screen and (max-width: $tablet) {
	.button-bar {
		flex-direction: column;
	}
}
</style>