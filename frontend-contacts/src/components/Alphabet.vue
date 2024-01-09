<script setup lang="ts">
import { ref } from 'vue';

import { BloomaTypes } from '@/blooma/enums/BloomaTypes'
import { BloomaValidationModes } from '@/blooma/enums/BloomaValidationModes'

import { AlphabetModes } from '@/enums/AlphabetModes'

import BButton from '@/blooma/BButton.vue'

const props = defineProps({})
const emits = defineEmits(['update:modelValue'])

const alphaMode = ref<AlphabetModes>(AlphabetModes.ALL)
const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
const letters = ref<string[]>([...alphabet])
const selectedLetter = ref(letters.value[0])

function updateParent() {
	// if all is selected update parent state with empty string
	if (alphaMode.value === AlphabetModes.ALL) {
		emits('update:modelValue', '')
	}
	else {
		emits('update:modelValue', selectedLetter.value)
	}
}

function selectLetter(letter: string) {
	alphaMode.value = AlphabetModes.ALPHA
	selectedLetter.value = letter
	updateParent()
}

function selectAll() {
	alphaMode.value = AlphabetModes.ALL
	updateParent()
}

</script>

<template lang="pug">
div
	div.letter
		BButton(
			:type="BloomaTypes.Primary"
			:light="alphaMode === AlphabetModes.ALPHA"
			@click="() => selectAll()"
		) all
	div.letter(v-for="(letter, index) in letters" :class="{ odd: index % 2 }")
		BButton(
			:type="BloomaTypes.Primary"
			:light="!(letter === selectedLetter && alphaMode === AlphabetModes.ALPHA)"
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

.odd > .button {
	// background: rgb(241, 241, 241);
	// color: red;
	// border: 2px red;
}
</style>