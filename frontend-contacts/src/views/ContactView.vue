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
import { Icon } from '@iconify/vue'
import BButton from '@/blooma/BButton.vue'
import Alphabet from '@/components/Alphabet.vue'
import SelectContact from '@/components/SelectContact.vue'
import EditContact from '@/components/EditContact.vue'
import SearchContact from '@/components/SearchContact.vue'
import BModal from '@/blooma/BModal.vue'

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

const selected = ref<number>(0) // id
const viewMode = ref<EditContactModes>(EditContactModes.VIEW)
const searchQuery = ref<string>('')
const searchMode = ref<ContactSearchModes>(ContactSearchModes.ALL)
const renderContact = ref(true) // TODO: remove this hack
const settingsModal = ref(false)

function toggleSettings() {
	settingsModal.value = !settingsModal.value
	if (settingsModal.value) {
		document.exitFullscreen()
	}
	else {
		document.body.requestFullscreen()
	}

}

function updateMode(mode: EditContactModes) {
	viewMode.value = mode
}

function updateSearchMode(mode: ContactSearchModes) {
	searchMode.value = mode
}

async function selectAndGetContact(id: number) {
	if (viewMode.value === EditContactModes.EDIT) {
		// Open dialog
		return
	}

	selected.value = id

	// no contact
	if (id === -1) {
		contact.value = null
		return		
	}
	// new contact
	else if (id === 0) {
		contact.value = new Contact(0, '', '', [])
		return
	}
	// existing contact
	else {
		try {
			await getContact(id)
		}
		catch (ex) {
			// TODO: toast error
			console.log(ex)
		}
	}
}

async function unselectContact() {
	await selectAndGetContact(-1)
	updateMode(EditContactModes.VIEW)
}

async function createContact() {
	await selectAndGetContact(0)
	updateMode(EditContactModes.EDIT)
}

async function searchContacts(sq: string) {
	searchQuery.value = sq
	await getContacts(searchQuery.value)
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

async function refreshContactsAndSelect(id: number) {
	updateSearchMode(ContactSearchModes.ALL)
	await getContacts()
	await selectAndGetContact(id)
}

onMounted(async () => {
	await getContacts()
})

</script>

<template lang="pug">
div.contact-container
	div.contact-layout(:class="contact && renderContact ? 'viewing' : ''")
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
			BButton.settings-btn(:type="BloomaTypes.Ghost" :light="true" @click="toggleSettings")
				span.icon
					//- Icon(icon="material-symbols:settings" width="22")
					Icon(icon="material-symbols:fullscreen" width="22")
				//- BModal(v-if="settingsModal")
				//- 	template(v-slot:header)
				//- 		p.modal-card-title Settings
				//- 	template(v-slot:content)
				//- 		div
				//- 			BButton Toggle dark mode
				//- 		div
				//- 			BButton Enable fullscreen
				//- 	template(v-slot:footer)
				//- 		BButton(:type="BloomaTypes.Default" @click="") Close
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
				@update="selectAndGetContact"
			)
		div.contact-view-container.scrollable
			EditContact(
				v-if="contact && renderContact"
				:key="contact.id"
				:contact="contact"
				:mode="viewMode"
				@updateMode="updateMode"
				@resetForm="resetForm"
				@updateId="refreshContactsAndSelect"
				@unselect="unselectContact"
			)
			h1(v-else)
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints

.contact-container {
	display: block;
	height: 100vh;
	width: 100vh;
}

.contact-layout {
	display: grid;
	grid-template-columns: 100px 280px 800px;
	grid-template-rows: 60px 1fr;
	gap: 0px 0px;
	height: 100%;
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

.end-nav-container {
	padding: 10px;
	display: flex;
	justify-content: end;
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

@media screen and (max-width: $tablet) {
	.contact-container {
		height: 100vh;
		width: 100%;
	}
	.contact-layout {
		grid-template-columns: 1fr 6fr 1fr;
		grid-template-rows: 60px 1fr;
	}

	.contact-select-container {
		grid-area: 2 / 2 / 3 / 4;
	}

	.end-nav-container {
		// justify-content: start;
		padding-left: 0px;
	}

	.contact-layout.viewing {
		// display: block;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;

		.new-container, .alphabet-container, .search-container, .contact-select-container, .end-nav-container {
			display: none;
		}
	}

	.new-container {
		padding: 10px;
		padding-left: 8px;
	}
}
</style>