<script setup lang="ts">
import { computed, watch, ref, inject, type PropType } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { FormLoadingKey } from '@/blooma/symbols'
import { BloomaTypes } from '@/blooma/enums/BloomaTypes'
import { BloomaValidationModes } from '@/blooma/enums/BloomaValidationModes'
import { BloomaSizes } from '@/blooma/enums/BloomaSizes'
import { ContactCustomField } from '@/requestTypes/ContactCustomField'
import { ContactCustomFieldTypes } from '@/enums/ContactCustomFieldTypes'

import { Icon } from '@iconify/vue'
import BButton from '@/blooma//BButton.vue'

const props = defineProps({
	modelValue: {
		type: Number,
		required: true,
	},
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
	list: {
		type: Object as PropType<ContactCustomField>,
		required: true,
	},
})

const emits = defineEmits(['update:modelValue'])

const formLoading = inject(FormLoadingKey)
const inputValue = ref<number>(props.modelValue)
const open = ref<boolean>(false)

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

// validate on blur
async function validateOnBlur(evt: any) {
	if (!props.val$) {
		return
	}

	await props?.val$?.$touch()
}

// validate on change after blur
async function validateOnInput(evt: any) {
	if (!props.val$) {
		return
	}

	await props?.val$?.$touch()
}

function updateParent(val: string) {
	emits('update:modelValue', parseInt(val)) // update model value
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
}

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

function toggleDropdown() {
	open.value = !open.value;
}

function selectDropdown(fieldType: ContactCustomFieldTypes) {
	open.value = false
	inputValue.value = fieldType
	emits('update:modelValue', fieldType)
}

function onClickAway(event: Event) {
	open.value = false
}

const fieldTypes = Object.keys(props.list).filter((v) => isNaN(Number(v)));
const fieldValues = Object.values(props.list)

</script>

<template lang="pug">
div.field
	label.label(v-show="showLabel") {{ placeholder }}
	//- div.control(:class="controlClasses")
	div.dropdown(:class="{ 'is-active': open }" v-click-away="onClickAway")
		div.dropdown-trigger
			BButton(aria-haspopup='true' aria-controls='dropdown-menu' @click="toggleDropdown")
				div.b-button-dropdown
					span {{ fieldTypes[inputValue] }}
					span.icon.is-small
						template(v-if="val$ && val$.$dirty")
							icon(v-if="loading" icon="eos-icons:loading" width="22")
							icon(v-else-if="inputClasses[BloomaTypes.Danger]" icon="icon-park-solid:attention" class="field-icon-error" width="22")
							icon(v-else-if="inputClasses[BloomaTypes.Success]" icon='icon-park-solid:check-one' class="field-icon-success" width="22")
		div#dropdown-menu.dropdown-menu(role='menu')
			div.dropdown-content
				a.dropdown-item(
					v-for="field in fieldTypes"
					:class="{ 'is-active': inputValue === ContactCustomFieldTypes[field] }"
					:value="field"
					@click="selectDropdown(ContactCustomFieldTypes[field])"
				) {{ field }}

		//- select(
		//- 	v-model="inputValue"
		//- 	:class="inputClasses"
		//- 	:placeholder="placeholder"
		//- 	:disabled="formLoading"
		//- 	@blur="handleValidationMode"
		//- 	@input="handleValidationMode"
		//- )
		//- 	option(v-for="field in fieldTypes" :value="ContactCustomFieldTypes[field]") {{ field }}
		span.icon.is-small.is-left(v-if="icon")
			//- icon(:icon="icon")
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

.b-button-dropdown {
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: space-between;
}

.dropdown, .dropdown-trigger{
	width: 100%
}

.dropdown-trigger > button {
	width: 100%;
	text-align: left;
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