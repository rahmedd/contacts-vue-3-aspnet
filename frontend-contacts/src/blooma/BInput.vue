<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useField } from 'vee-validate';
import { useDebounceFn } from '@vueuse/core'
import { Icon } from '@iconify/vue';

const props = defineProps({
	modelValue: String,
	name: {
		type: String,
		required: true
	},
	loading: {
		type: Boolean,
		default: false
	},
	placeholder: String,
	icon: String,
})

const emits = defineEmits(['update:modelValue'])

const { value, errorMessage, errors, meta, handleBlur, handleChange, setTouched, validate } = useField(() => props.name,
	undefined, // validator is provided by form
	{
		validateOnValueUpdate: false
	}
);

const inputClasses = computed(() => {
	const validated = meta.validated && !meta.pending

	return {
		'input': true,
		'validated': validated,
		'is-danger': validated && !meta.valid,
		'is-success': validated && meta.valid,
	}
})

const inputClassesDebounced = ref({
	'input': true,
	'validated': false,
	'is-danger': false,
	'is-success': false,
})

const debounceinputClasses = useDebounceFn(() => {
	inputClassesDebounced.value['validated'] = inputClasses.value['validated']
	inputClassesDebounced.value['is-danger'] = inputClasses.value['is-danger']
	inputClassesDebounced.value['is-success'] = inputClasses.value['is-success']
}, 50)

watch(inputClasses, async () => {
	await debounceinputClasses()
})

// validate on blur
async function validateOnBlur(evt: Event) {
	handleBlur(evt)
	setTouched(true)
	validate()
	await debounceinputClasses()
}

// validate on change after blur
async function validateOnChange(evt: Event) {
	if (!meta.touched) {
		return
	}

	handleChange(evt, true)
	setTouched(true)
	validate()
	await debounceinputClasses()
}

const controlClasses = computed(() => ({
	'has-icons-left': !!props.icon,
	'has-icons-right': true
}))

</script>

<template lang="pug">
div.field
	label.label {{ placeholder }}
	div.control(:class="controlClasses")
		input(
			v-model="value"
			type="text"
			:class="inputClassesDebounced"
			:placeholder="placeholder"
			@blur="validateOnBlur"
			@input="validateOnChange"
		)
		span(v-if="icon").icon.is-small.is-left
			icon(:icon="icon")
		span.icon.is-small.is-right
			template(v-if="meta.touched")
				icon(v-if="loading" icon="eos-icons:loading" class="field-icon-error" width="22")
				icon(v-else-if="inputClassesDebounced['is-danger']" icon="icon-park-solid:attention" class="field-icon-error" width="22")
				icon(v-else-if="inputClassesDebounced['is-success']" icon='icon-park-solid:check-one' class="field-icon-success" width="22")
	Transition
		div(v-if="errorMessage").help.is-danger {{ errorMessage }}
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints
@import "bulma/sass/utilities/derived-variables.sass"; // color variables

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
	color: $success;
	// color: $bl-primary;
}

.field-icon-error {
	color: $danger;
}

.input.is-success {
	// border-color: $bl-primary;
}

.input {
	transition: border-color 0.1s ease;
}

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>