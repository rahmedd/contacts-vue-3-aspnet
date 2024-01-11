<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue';

import { BloomaTypes } from '@/blooma/enums/BloomaTypes'

import { ContactSearchModes } from '@/enums/ContactSearchModes'

import BButton from '@/blooma/BButton.vue'


const props = defineProps({
	modelValue: String,
	searchMode: {
		type: Number as PropType<ContactSearchModes>,
		required: true,
	},
})

const emits = defineEmits([
	'update:modelValue',
	'update:searchMode',
])

const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
const letters = ref<string[]>([...alphabet])
const selectedLetter = ref(letters.value[0])

function updateMode(mode: ContactSearchModes) {
	emits('update:searchMode', mode)
}

function updateModel() {
	emits('update:modelValue', selectedLetter.value)
}

function selectLetter(letter: string) {
	updateMode(ContactSearchModes.ALPHA)
	selectedLetter.value = letter
	updateModel()
}

function selectAll() {
	updateMode(ContactSearchModes.ALL)
	selectedLetter.value = ''
	updateModel()
}
</script>

<template lang="pug">
div
	div.letter
		BButton(
			:type="BloomaTypes.Primary"
			:light="searchMode === ContactSearchModes.ALPHA"
			@click="() => selectAll()"
		) all
	div.letter(v-for="(letter, index) in letters" :class="{ odd: index % 2 }")
		BButton(
			:type="BloomaTypes.Primary"
			:light="!(letter === selectedLetter && searchMode === ContactSearchModes.ALPHA)"
			@click="() => selectLetter(letter)"
		) {{ letter }}
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints

.letter {
	text-align: center;
	font-size: 32px;
	// padding: 2px;
	background: #608a5d;
	// color: white;
}

.button {
	width: 100%;
	font-size: 24px;
	font-weight: 600;
	border-radius: 0;
}
</style>