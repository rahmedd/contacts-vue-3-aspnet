<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth'
import { BloomaTypes } from '@/blooma/enums/BloomaTypes'
import { BloomaValidationModes } from '@/blooma/enums/BloomaValidationModes'
import { Contact } from '@/requestTypes/Contact'
import { ContactResponse } from '@/responseTypes/ContactResponse';
import { useAxios } from '@vueuse/integrations/useAxios'
import type User from '@/responseTypes/User';
import { EditContactModes } from '@/enums/EditContactModes';
import apiClient from '@/services/axios';
import BButton from '@/blooma/BButton.vue'
import BInput from '@/blooma/BInput.vue'
import Alphabet from '@/components/Alphabet.vue'
import SelectContact from '@/components/SelectContact.vue'
import EditContact from '@/components/EditContact.vue'
import type BaseReponse from '@/responseTypes/BaseResponse';
import { useGetContact } from '@/composables/ContactMethods';

const authStore = useAuthStore()

const {
	data: contacts,
	isLoading: isLoading,
	isFinished: isFinished,
} = useAxios<BaseReponse<ContactResponse[]>>('Contact', { method: 'GET' }, apiClient, { immediate: true })

// const {
// 	data: contact,
// 	isLoading: contactIsLoading,
// 	isFinished: contactisFinished,
// 	execute: getContact,
// } = useAxios<BaseReponse<ContactResponse>>(`Contact/0`, { method: 'GET' }, apiClient, { immediate: false })

const {
	data: contact,
	state: contactState,
	update: getContact,
} = useGetContact()

// const contacts = ref<ContactResponse[]>([])
const selected = ref<number>(0) // id
const viewMode = ref<EditContactModes>()

async function selectContact(id: number) {
	if (viewMode.value === EditContactModes.EDIT) {
		// Open dialog
		return
	}

	selected.value = id

	try {
		// await getContact(`Contact/${id}`)
		await getContact(id)
	}
	catch (ex) {
		// TODO: toast error
		console.log(ex)
	}
}

function updateMode(mode: EditContactModes) {
	viewMode.value = mode
}

</script>

<template lang="pug">
div.contact-container
	div.contact-layout
		div.new-container
			BButton.new-contact-btn(:type="BloomaTypes.Primary" @click="") +
		div.search-container
			BInput(placeholder='Search' name='search' :mode="BloomaValidationModes.Aggressive" :showLabel="false" :debounce="250")
		div.end-nav-container
			//- p hello3
		div.alphabet-container.scrollable
			Alphabet
		div.contact-select-container.scrollable
			SelectContact(v-if="contacts" :contacts="contacts?.body" :selected="selected" @update="selectContact")
		div.contact-view-container.scrollable
			EditContact(v-if="contact" :key="contact.id" :contact="contact" @mode="updateMode")
			h1(v-else)
			//- h1(v-else) Select a contact
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints

.contact-container {
	// display: block;
	// height: 100vh;
}

.contact-layout {
	display: grid;
	grid-template-columns: 100px 280px 500px;
	grid-template-rows: 60px 1fr;
	gap: 0px 0px;
	// grid-auto-flow: row;
	// grid-template-areas:
	// 	". . ."
	// 	". . .";
	height: 100vh;
}

.new-container {
	padding: 10px;
	padding-left: 5px;
	// background: $bl-primary-light;
	.button {
		font-size: 24px;
		font-weight: 600;
		height: 100%;
	}
}

.search-container {
	padding: 10px;
	.input {
		height: 100%;
	}
}

.new-contact-btn {
	width: 100%;
}

.alphabet-container {

}

 /* Hide scrollbar for Chrome, Safari and Opera */
// .alphabet-container::-webkit-scrollbar {
//   display: none;
// }

// /* Hide scrollbar for IE, Edge and Firefox */
// .alphabet-container {
//   -ms-overflow-style: none;  /* IE and Edge */
//   scrollbar-width: none;  /* Firefox */
// } 

.scrollable {
	overflow-y: scroll;
}

.contact-view-container > h1 {
	font-size: 24px;
	font-weight: bold;
	margin-left: 16px;
}

</style>