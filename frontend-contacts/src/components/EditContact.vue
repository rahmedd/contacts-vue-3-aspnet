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
import BButton from '@/blooma/BButton.vue'
import BInput from '@/blooma/BInput.vue'

console.log('editcontact rendered')

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

function selectContact(id: number) {
	emits('update', id)
}

async function saveContact() {
	return
}

async function deleteContact(id: number) {
	return
}

function edited() {
	mode.value = EditContactModes.EDIT
	emits('mode', mode.value)
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
	div.row-split(@input="edited")
		BInput(placeholder='First name' name='firstname' v-model='formValue.firstname' :show-success="true" :mode="BloomaValidationModes.Aggressive" :debounce="250" :disabled="true")
		BInput(placeholder='Last name' name='lastname' v-model='formValue.lastname' :show-success="true" :mode="BloomaValidationModes.Aggressive" :debounce="250")
	div.button-bar
		BButton(:type="BloomaTypes.Primary" @click="saveContact" :disabled="mode === EditContactModes.VIEW") Save
		BButton(:type="BloomaTypes.Danger" @click="deleteContact") Delete
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints

.edit-contact-container {
	margin-left: 10px;
	margin-right: 10px;
}

.row-split {
	display: flex;
	.field {
		margin-right: 10px;
	}
}

.button-bar {
	display: flex;
	justify-content: space-between;
}

@media screen and (max-width: $tablet) {
	.button-bar {
		flex-direction: column;
	}
}
</style>