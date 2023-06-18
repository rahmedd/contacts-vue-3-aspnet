<script setup lang="ts">
import { ref, type PropType, computed } from 'vue';
import { BloomaTypes } from '@/blooma/enums/BloomaTypes';
import { useField } from 'vee-validate';
import { Icon } from '@iconify/vue';

const props = defineProps({
	name: {
		type: String,
		required: true
	},
	placeholder: String,
	modelValue: String,
	icon: String,
})

const emits = defineEmits(['update:modelValue'])

const { value, errorMessage, errors, meta, handleBlur, setTouched, validate } = useField(() => props.name,
	undefined, // validator is provided by form
	{
		validateOnValueUpdate: false
	}
);

const controlClasses = computed(() => ({
	'has-icons-left': !!props.icon,
	'has-icons-right': true
}))

const inputClasses = computed(() => ({
	'input': true,
	'is-danger': !meta.valid && meta.validated && !meta.pending
}))

const validationIcon = computed(() => ({
	showValidation: meta.touched && inputClasses.value['is-danger'],
}))

function validateOnBlur (evt: Event) {
	handleBlur(evt)
	setTouched(true)
	validate()
}

</script>

<template lang="pug">
div.field
	label.label {{ placeholder }}
	div.control(:class="controlClasses")
		input(
			v-model="value"
			type="text"
			:class="inputClasses"
			:placeholder="placeholder"
			@blur="validateOnBlur"
		)
		span(v-if="icon").icon.is-small.is-left
			icon(:icon="icon")
		span.icon.is-small.is-right
			template(v-if="meta.touched")
				icon(v-if="inputClasses['is-danger']" icon='ic:baseline-error' class="field-icon-error" width="24")
				icon(v-else icon='ic:round-check' class="field-icon-success" width="24")


	div.help.is-danger {{ errorMessage }}
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "../node_modules/bulma/sass/utilities/initial-variables.sass"; // breakpoints
@import "../node_modules/bulma/sass/utilities/derived-variables.sass"; // breakpoints

.field {
	height: 5.5rem;
}

.label {
	font-size: 0.9rem;
	font-weight: 500;
	// margin-bottom: 0.4em;
	color: #03363e;
}

.field-icon-success {
	// color: $success;
	color: $bl-primary;
}

.field-icon-error {
	color: $danger;
}
</style>