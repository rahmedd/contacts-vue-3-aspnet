<script setup lang="ts">
import { ref, type PropType, computed } from 'vue';
import { FullmoonTypes } from '@/fullmoon/FullmoonTypes';
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
	'form-control': true,
	'is-invalid': !meta.valid && meta.validated && !meta.pending
}))

function validateOnBlur (evt: Event) {
	handleBlur(evt)
	setTouched(true)
	validate()
}

</script>

<template lang="pug">
div.f-input
	input(
		v-model="value"
		type="text"
		:class="classObject"
		:placeholder="placeholder"
		@blur="validateOnBlur"
	)
	div.f-input-error {{ errorMessage }}
</template>

<style lang="scss" scoped>
.f-input {
	display: flex;
	flex-direction: column;
	height: 60px;
}
.f-input > input {
	margin-bottom: 2px;
}
.f-input-error {
	color: #ff4d4f;
}
</style>