<script setup lang="ts">
import { ref, type PropType, onMounted, computed } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import {
	object as zobject,
	string as zstring
} from 'zod';
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

// const {
// 	data: contact,
// 	isLoading: isLoading,
// 	isFinished: isFinished,
// 	execute: execute,
	
// } = useAxios<BaseReponse<ContactResponse>>(`Contact/${props.contact.id}`, { method: 'GET' }, apiClient, { immediate: false })

// const formSchema = toTypedSchema(
// 	zobject({
// 		username: zstring()
// 			.min(4, { message: 'Username must be at least 4 characters long' })
// 			// .refine(checkUsernameCached, "Username not available")
// 		,
// 		password: zstring()
// 			.min(8, { message: 'Passsword must be at least 8 characters long' })
// 		,
// 		confirmPassword: zstring()
// 			.min(8, { message: 'Passsword must be at least 8 characters long' })
// 			// .refine(s => s === formValue.value.password, { message: 'Passwords do not match' })
// 		,
// 	})
// )

const formValue = ref<Contact>({
	firstname: props.contact.firstname,
	lastname: props.contact.lastname,
	customFields: props.contact.customFields,
})

const mode = ref<EditContactModes>(EditContactModes.VIEW)
const deleteModal = ref<boolean>(false)

function selectContact(id: number) {
	emits('update', id)
}

async function saveContact() {
	mode.value = EditContactModes.VIEW
	return
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

function log(str: string) {
	console.log(str)
}

const abc = ref(new Date())

onMounted(() => {
	emits('mode', mode.value)
})
</script>

<template lang="pug">
div.edit-contact-container
	div.contact-form(@input="edited")
		div.row-split
			BInput(placeholder='First name' name='firstname' v-model='formValue.firstname' :show-success="true" :mode="BloomaValidationModes.Aggressive" :debounce="250")
			BInput(placeholder='Last name' name='lastname' v-model='formValue.lastname' :show-success="true" :mode="BloomaValidationModes.Aggressive" :debounce="250")
		div.row-split(v-for="field in formValue.customFields")
			//- p {{ field }}
			BInput(:placeholder="field.fieldName" :name="field.fieldName" v-model="field.fieldValue" :show-success="true" :mode="BloomaValidationModes.Aggressive" :debounce="250")

	div.button-bar
		BButton(:type="BloomaTypes.Primary" @click="saveContact" :disabled="mode === EditContactModes.VIEW") Save
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
	.field:not(:last-child) {
		margin-right: 10px;
	}
	margin-left: $gap;
	margin-right: $gap;
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