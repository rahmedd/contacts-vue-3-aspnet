<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth'
import { BloomaTypes } from '@/blooma/enums/BloomaTypes'
import { BloomaValidationModes } from '@/blooma/enums/BloomaValidationModes'
import { Contact } from '@/requestTypes/Contact'
import { ContactResponse } from '@/responseTypes/ContactResponse';
import BButton from '@/blooma/BButton.vue'
import BInput from '@/blooma/BInput.vue'
import Alphabet from '@/components/Alphabet.vue'
import SelectContact from '@/components/SelectContact.vue'
import EditContact from '@/components/EditContact.vue'

const authStore = useAuthStore()
const contacts = ref<ContactResponse[]>([])
const selected = ref<number>(0) // id
for (let i = 0; i < 20; i++) {
	contacts.value.push(
		new ContactResponse(Math.floor(Math.random() * 9999999), 'lorem', 'ipsum', [
			{
				fieldName: 'Birthday',
				fieldValue: '2000-04-21',
				fieldType: "DATE",
			}
		])
	)
}

function selectContact(id: number) {
	console.log(id)
	selected.value = id
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
			SelectContact(:contacts="contacts" :selected="selected" @update="selectContact")
		div.contact-view-container.scrollable
			EditContact(:contact="contacts[selected]")
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
	grid-template-columns: 100px 250px 500px;
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

</style>