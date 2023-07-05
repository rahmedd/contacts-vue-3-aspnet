<script setup lang="ts">
import { computed, watch, ref, inject, type PropType, toRef } from 'vue';
import { useField } from 'vee-validate';
import { useDebounceFn } from '@vueuse/core'
import { Icon } from '@iconify/vue';
import { FormLoadingKey } from '@/blooma/symbols';
import { BloomaTypes } from '@/blooma/enums/BloomaTypes';
import { BloomaValidationModes } from '@/blooma/enums/BloomaValidationModes';

const props = defineProps({
	modelValue: String,
	placeholder: String,
	icon: String,
	name: {
		type: String,
		required: true,
	},
	loading: {
		type: Boolean,
		default: false,
	},
	showSuccess: {
		type: Boolean,
		default: false,
	},
	mode: {
		type: String as PropType<BloomaValidationModes>,
		default: BloomaValidationModes.Eager
	},
	debounce: {
		type: Number,
		default: 0,
	}
})

const emits = defineEmits(['update:modelValue'])

const formLoading = inject(FormLoadingKey)

const inputValue = ref<string>(props.modelValue || '')

const { value, errorMessage, meta, handleBlur, handleChange, setTouched, validate } = useField(
	toRef(props, 'name'),
	undefined, // validator is provided by form
	{
		initialValue: props.modelValue,
		validateOnValueUpdate: false,
		syncVModel: false, // handle emits manually for debounced input
	}
);

const inputClasses = computed(() => {
	const validated = meta.validated && !meta.pending

	return {
		input: true,
		validated: validated,
		[BloomaTypes.Danger]: validated && !meta.valid,
		[BloomaTypes.Success]: validated && meta.valid && props.showSuccess,
	}
})

const inputClassesDebounced = ref({
	input: true,
	validated: false,
	[BloomaTypes.Danger]: false,
	[BloomaTypes.Success]: false,
})

const debounceinputClasses = useDebounceFn(() => {
	inputClassesDebounced.value.validated = inputClasses.value.validated
	inputClassesDebounced.value[BloomaTypes.Danger] = inputClasses.value[BloomaTypes.Danger]
	inputClassesDebounced.value[BloomaTypes.Success] = inputClasses.value[BloomaTypes.Success]
}, 50)

watch(inputClasses, async () => {
	await debounceinputClasses()
})

// validate on blur
async function validateOnBlur(evt: Event) {
	handleBlur(evt)
	setTouched(true)
	validate()
}

// validate on change after blur
async function validateOnInput(evt: Event) {
	handleChange(evt, false)
	setTouched(true)
	validate()
}

async function handleValidationMode(evt: Event) {
	const val = (evt.target as HTMLInputElement).value
	value.value = val // update vee-validate internal state
	emits('update:modelValue', val) // update model value

	const mode: BloomaValidationModes = props.mode

	switch (evt.type) {
		case 'blur':
			switch (mode) {
				case BloomaValidationModes.Aggressive:
					await validateOnBlur(evt)
					break;
				case BloomaValidationModes.Eager:
					await validateOnBlur(evt)
					break;
				case BloomaValidationModes.Lazy:
					await validateOnBlur(evt)
					break;
				case BloomaValidationModes.Passive:
					break;
			}
			break;

		case 'input':
			switch (mode) {
				case BloomaValidationModes.Aggressive:
					await validateOnInput(evt)
					break;
				case BloomaValidationModes.Eager:
					if (!meta.touched) {
						break;
					}
					await validateOnInput(evt)
					break;
				case BloomaValidationModes.Lazy:
					// Issue with vee-validate, executing validations even though validateOnValueUpdate: false
					break;
				case BloomaValidationModes.Passive:
					break;
			}
			break;
	}

	await debounceinputClasses()
}

const handleValidationModeDebounce = useDebounceFn(handleValidationMode, props.debounce)

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
			v-model="inputValue"
			type="text"
			:class="inputClassesDebounced"
			:placeholder="placeholder"
			@blur="handleValidationModeDebounce"
			@input="handleValidationModeDebounce"
			:disabled="formLoading"
		)
		span(v-if="icon").icon.is-small.is-left
			icon(:icon="icon")
		span.icon.is-small.is-right
			template(v-if="meta.touched")
				icon(v-if="loading" icon="eos-icons:loading" width="22")
				icon(v-else-if="inputClassesDebounced[BloomaTypes.Danger]" icon="icon-park-solid:attention" class="field-icon-error" width="22")
				icon(v-else-if="inputClassesDebounced[BloomaTypes.Success]" icon='icon-park-solid:check-one' class="field-icon-success" width="22")
	Transition
		div(v-if="inputClassesDebounced[BloomaTypes.Danger] && errorMessage").help.is-danger {{ errorMessage }}
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
	transition: border-color 0.2s ease;
}

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>