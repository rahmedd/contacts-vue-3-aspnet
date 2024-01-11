<script setup lang="ts">
// lib
import { ref, onMounted, nextTick } from 'vue';
import { useAuthStore } from '@/stores/auth'
import { useGetContact, useGetContacts } from '@/composables/ContactMethods';

// blooma
import { BloomaTypes } from '@/blooma/enums/BloomaTypes'
import { BloomaValidationModes } from '@/blooma/enums/BloomaValidationModes'

// types
import { EditContactModes } from '@/enums/EditContactModes';
import { Contact } from '@/requestTypes/Contact'
import { ContactSearchModes } from '@/enums/ContactSearchModes'

// components
import BButton from '@/blooma/BButton.vue'
import BInput from '@/blooma/BInput.vue'
import Alphabet from '@/components/Alphabet.vue'
import SelectContact from '@/components/SelectContact.vue'
import EditContact from '@/components/EditContact.vue'
import SearchContact from '@/components/SearchContact.vue'

const authStore = useAuthStore()

const { 
	data: contacts,
	state: contactsState,
	action: getContacts
 } = useGetContacts()

const {
	data: contact,
	state: contactState,
	action: getContact,
} = useGetContact()

// const contacts = ref<ContactResponse[]>([])
const selected = ref<number>(0) // id
const viewMode = ref<EditContactModes>(EditContactModes.VIEW)
const searchQuery = ref<string>('')
const searchMode = ref<ContactSearchModes>(ContactSearchModes.ALL)
const renderContact = ref(true) // TODO: remove this hack

function updateMode(mode: EditContactModes) {
	viewMode.value = mode
}

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

function createContact() {
	contact.value = new Contact(0, '', '', [])
	updateMode(EditContactModes.EDIT)
}

async function searchContacts(sq: string) {
	searchQuery.value = sq
	await getContacts(searchQuery.value)
}

function updateSearchMode(mode: ContactSearchModes) {
	searchMode.value = mode
}

// TODO: remove this hack
async function resetForm() {
	if (!contact.value) {
		return
	}

	renderContact.value = false
	await nextTick()
	renderContact.value = true
}

onMounted(async () => {
	await getContacts()
})

</script>

<template lang="pug">
div.contact-container
	div.contact-layout
		div.new-container
			BButton.new-contact-btn(:type="BloomaTypes.Primary" @click="createContact") +
		div.search-container
			SearchContact(
				v-model="searchQuery"
				@update:modelValue="searchContacts"
				:searchMode="searchMode"
				@update:searchMode="updateSearchMode"
			)
		div.end-nav-container
			//- p hello3
		div.alphabet-container.scrollable
			Alphabet(
				v-model="searchQuery"
				@update:modelValue="searchContacts"
				:searchMode="searchMode"
				@update:searchMode="updateSearchMode"
			)
		div.contact-select-container.scrollable
			SelectContact(
				:contacts="contacts"
				:selected="selected"
				:mode="viewMode"
				@update="selectContact"
			)
		div.contact-view-container.scrollable
			EditContact(
				v-if="contact && renderContact"
				:key="contact.id"
				:contact="contact"
				:mode="viewMode"
				@mode="updateMode"
				@resetForm="resetForm"
			)
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
	grid-template-columns: 100px 280px 800px;
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