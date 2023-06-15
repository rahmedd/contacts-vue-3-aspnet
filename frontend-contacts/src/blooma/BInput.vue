<script setup lang="ts">
import { ref, type PropType, computed } from 'vue';
import { BloomaTypes } from '@/blooma/enums/BloomaTypes';
import { useField } from 'vee-validate';

const props = defineProps({
	name: {
		type: String,
		required: true
	},
	placeholder: String,
	modelValue: String,
})

const emits = defineEmits(['update:modelValue'])

const { value, errorMessage, errors, meta, handleBlur, setTouched, validate } = useField(() => props.name);

const classObject = computed(() => ({
	'input': true,
	'is-danger': !meta.valid && meta.validated && !meta.pending
}))

function validateOnBlur (evt: Event) {
	handleBlur(evt)
	setTouched(true)
	validate()
}

</script>

<template lang="pug">
div.field
	label.label {{ props.placeholder }}
	input(
		v-model="value"
		type="text"
		:class="classObject"
		:placeholder="placeholder"
		@blur="validateOnBlur"
	)
	div.help.is-danger {{ errorMessage }}
</template>

<style lang="scss" scoped>
.field {
	height: 5.5rem;
}

.label {
	font-size: 0.9rem;
	font-weight: 500;
	// margin-bottom: 0.4em;
	color: #03363e;
}
</style>