<script setup lang="ts">
import { computed, watch, ref, inject, type PropType} from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { FormLoadingKey } from '@/blooma/symbols'
import { BloomaTypes } from '@/blooma/enums/BloomaTypes'
import { BloomaValidationModes } from '@/blooma/enums/BloomaValidationModes'
import { BloomaSizes } from '@/blooma/enums/BloomaSizes'

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
	showLabel: {
		type: Boolean,
		default: true,
	},
	mode: {
		type: String as PropType<BloomaValidationModes>,
		default: BloomaValidationModes.Eager,
	},
	debounce: {
		type: Number,
		default: 0,
	},
	size: {
		type: String as PropType<BloomaSizes>,
		default: BloomaSizes.Default,
	},
	val$: {
		type: Object // vuelidate types don't work
	},
	// TODO: replace with datepicker component
	date: {
		type: Boolean
	}
})

const emits = defineEmits(['update:modelValue'])

const formLoading = inject(FormLoadingKey)
const inputValue = ref<string>(props.modelValue || '')

const meta = {
	validated: false,
	pending: false,
	valid: true,
	touched: false,
}

const inputClasses = computed(() => {
	const v$ = props.val$

	// if validator was not passed return default input
	if (!v$) {
		return {
			input: true,
			validated: false,
			[props.size]: !!props.size,
			[BloomaTypes.Danger]: false,
			[BloomaTypes.Success]: false,
		}
	}

	const validated = v$.$dirty && !v$.$pending

	return {
		input: true,
		validated: !!validated,
		[props.size]: !!props.size,
		[BloomaTypes.Danger]: !!(validated && v$.$invalid),
		[BloomaTypes.Success]: !!(validated && !v$.$invalid && props.showSuccess),
	}
})

// const inputClassesDebounced = ref({
// 	input: true,
// 	validated: false,
// 	[props.size]: true,
// 	[BloomaTypes.Danger]: false,
// 	[BloomaTypes.Success]: false,
// })

// const debounceinputClasses = useDebounceFn(() => {
// 	inputClassesDebounced.value.validated = inputClasses.value.validated
// 	inputClassesDebounced.value[props.size] = inputClasses.value[props.size]
// 	inputClassesDebounced.value[BloomaTypes.Danger] = inputClasses.value[BloomaTypes.Danger]
// 	inputClassesDebounced.value[BloomaTypes.Success] = inputClasses.value[BloomaTypes.Success]
// }, 50)

// watch(inputClasses, async () => {
// 	await debounceinputClasses()
// })

// validate on blur
async function validateOnBlur(evt: any) {
	// handleBlur(evt)
	// setTouched(true)
	// validate()
	if (!props.val$) {
		return
	}

	await props?.val$?.$touch()
}

// validate on change after blur
async function validateOnInput(evt: any) {
	// handleChange(evt, false)
	// setTouched(true)
	// validate()

	if (!props.val$) {
		return
	}

	await props?.val$?.$touch()
}

function updateParent(val: string) {
	emits('update:modelValue', val) // update model value
}

const updateParentDebounced = useDebounceFn(updateParent, props.debounce)
const touchDebounced = useDebounceFn(async () => await props?.val$?.$touch(), props.debounce)

async function handleValidationMode(evt: Event) {
	const val = (evt.target as HTMLInputElement).value
	const mode: BloomaValidationModes = props.mode
	const v$ = props.val$ || {}

	// updateParent(val)
	await updateParentDebounced(val)

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
					// await validateOnInput(evt)
					await touchDebounced()
					break;
				case BloomaValidationModes.Eager:
					if (!v$.$dirty) {
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
	// await debounceinputClasses()
}

// const handleValidationModeDebounce = useDebounceFn(handleValidationMode, props.debounce)

const controlClasses = computed(() => ({
	'has-icons-left': !!props.icon,
	'has-icons-right': true
}))

const fieldMsg = computed(() => {
	const hasError = inputClasses.value[BloomaTypes.Danger]
	const msg: string = props?.val$?.$errors[0]?.$message || ''
	if (hasError && msg) {
		return msg
	}

	return ''
})

</script>

<template lang="pug">
div.field
	label.label(v-show="showLabel") {{ placeholder }}
	div.control(:class="controlClasses")
		input(
			v-model="inputValue"
			:type="date ? 'date' : 'text'"
			:class="inputClasses"
			:placeholder="placeholder"
			:disabled="formLoading"
			@blur="handleValidationMode"
			@input="handleValidationMode"
		)
		span(v-if="icon").icon.is-small.is-left
			icon(:icon="icon")
		span.icon.is-small.is-right
			template(v-if="val$ && val$.$dirty")
				icon(v-if="loading" icon="eos-icons:loading" width="22")
				icon(v-else-if="inputClasses[BloomaTypes.Danger]" icon="icon-park-solid:attention" class="field-icon-error" width="22")
				icon(v-else-if="inputClasses[BloomaTypes.Success]" icon='icon-park-solid:check-one' class="field-icon-success" width="22")
	Transition
		div.help.is-danger(v-if="fieldMsg") {{ fieldMsg }}
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints
@import "bulma/sass/utilities/derived-variables.sass"; // color variables

.field:has(.input.is-small) {
	height: 75px;
}

.field:has(.input.is-default) {
	height: 85px;
}

.label {
	font-size: 0.9rem;
	font-weight: 500;
	margin-bottom: 4px;
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