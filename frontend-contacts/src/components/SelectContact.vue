<script setup lang="ts">
import { type PropType, computed } from 'vue';
import { klona } from 'klona/json'
import { BloomaTypes } from '@/blooma/enums/BloomaTypes'
import { EditContactModes } from '@/enums/EditContactModes';
import { ContactResponse } from '@/responseTypes/ContactResponse';
import BButton from '@/blooma/BButton.vue'


const props = defineProps({
	contacts: {
		type: Array as PropType<ContactResponse[]>,
		required: true,
	},
	selected: {
		type: Number,
		required: true,
	},
	mode: {
		type: Number as PropType<EditContactModes>,
		// required: true,
	},
})

const emits = defineEmits<{
	update: [id: number]
}>()

function selectContact(id: number) {
	emits('update', id)
	// selected.value = id
}

const sortedContacts = computed(() => {
	const contactsClone = klona(props.contacts)
	contactsClone.sort((a, b) => a.firstname.normalize().localeCompare(b.firstname.normalize()))

	return contactsClone
})

</script>

<template lang="pug">
div
	div(v-for="contact in sortedContacts")
		BButton(
			:type="BloomaTypes.Primary"
			:light="contact.id !== selected"
			:disabled="mode === EditContactModes.EDIT"
			@click="() => selectContact(contact.id)"
		)
			span {{ contact.firstname }} {{ contact.lastname }}
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints

.button {
	width: 100%;
	font-size: 24px;
	font-weight: 600;
	border-radius: 0;
	text-align: left;

	span {
		width: 100%;
	}
}

.button.is-primary[disabled] {
	border: none;
}

</style>