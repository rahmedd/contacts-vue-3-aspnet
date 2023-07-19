<script setup lang="ts">
import { ref } from 'vue';
import { BloomaTypes } from '@/blooma/enums/BloomaTypes'
import { BloomaValidationModes } from '@/blooma/enums/BloomaValidationModes'
import BButton from '@/blooma/BButton.vue'

const props = defineProps()

const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
const letters = ref<string[]>(['all', ...alphabet])
const selected = ref(letters.value[0])

</script>

<template lang="pug">
div
	div.letter(v-for="(letter, index) in letters" :class="{ odd: index % 2 }")
		BButton(
			:type="BloomaTypes.Primary"
			:light="letter !== selected"
			@click="() => selected = letter"
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