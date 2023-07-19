<script setup lang="ts">
import { type PropType } from 'vue';
import { BloomaTypes } from '@/blooma/enums/BloomaTypes'
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
	}
})

const emits = defineEmits<{
	update: [id: number]
}>()

function selectContact(id: number) {
	emits('update', id)
	// selected.value = id
}

</script>

<template lang="pug">
div
	div(v-for="contact in contacts")
		BButton(
			:type="BloomaTypes.Primary"
			:light="contact.id !== selected"
			@click="() => selectContact(contact.id)"
		)  {{ contact.firstName }} {{ contact.lastName }}
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
}

</style>