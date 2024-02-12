<script setup lang="ts">
import { reactive, type PropType, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { customValidatorBase } from '@/validation/customValidatorBase'
import { fieldTypeValidator } from '@/validation/fieldTypeValidator'

import { BloomaValidationModes } from '@/blooma/enums/BloomaValidationModes'
import { BloomaTypes } from '@/blooma/enums/BloomaTypes'

import type { ContactCustomField } from '@/requestTypes/ContactCustomField'
import { ContactCustomFieldTypes } from "@/enums/ContactCustomFieldTypes"

import { Icon } from '@iconify/vue'
import BInput from '@/blooma/BInput.vue'
import BSelect from '@/blooma/BSelect.vue'
import BButton from '@/blooma/BButton.vue'
import { BloomaInputTypes } from '@/blooma/enums/BloomaInputTypes'

const props = defineProps({
	field: {
		type: Object as PropType<ContactCustomField>,
		required: true,
	},
	simple: {
		type: Boolean,
	}
})

const emits = defineEmits<{
	update: [field: ContactCustomField],
	delete: [field: ContactCustomField],
}>()

const form = reactive<ContactCustomField>({ ...props.field })

const isRequired = helpers.withMessage('Required', required)
// this rule isn't actaually async but it's the only way I can pass the params
const asyncValidator = helpers.withAsync(
	customValidatorBase(fieldTypeValidator),
	() => props.field.fieldType,
)

const rules = {
	fieldName: { isRequired, },
	fieldType: { isRequired, },
	fieldValue: {
		isRequired,
		dynRule: asyncValidator,
	},
}

const v$ = useVuelidate(rules, form)

function updateField() {
	emits('update', { ...form })
}

function deleteField() {
	emits('delete', { ...form })
}

const fieldTypes = Object.keys(ContactCustomFieldTypes).filter((v) => isNaN(Number(v)));

// const mapping = {
// 	[ContactCustomFieldTypes.TDATE]: 'Date',
// 	[ContactCustomFieldTypes.TSTRING]: 'Text',
// }

function updateFieldName(val: string) {
	form.fieldName = val
	updateField()
}

function updateFieldValue(val: string) {
	form.fieldValue = val
	updateField()
}

function updateFieldType(evt: ContactCustomFieldTypes) {
	form.fieldType = evt
	updateField()
}

const inputType = computed(() => {
	if (form.fieldType === ContactCustomFieldTypes.DATE) {
		return BloomaInputTypes.DATE
	}

	return BloomaInputTypes.TEXT
})

</script>

<template lang="pug">
div.field-row
	div.field
		BInput(
			placeholder="Label"
			name="fieldname"
			:debounce="250"
			:showLabel="true"
			:val$="v$.fieldName"
			:modelValue="form.fieldName"
			@update:modelValue="updateFieldName"
		)
	div.field
		BInput(
			placeholder="Value"
			name="fieldvalue"
			:debounce="250"
			:showLabel="true"
			:val$="v$.fieldValue"
			:inputType="inputType"
			:modelValue="form.fieldValue"
			@update:modelValue="updateFieldValue"
		)
	div(v-if="!simple")
		BSelect(
			placeholder="Type"
			name="fieldtype"
			:mode="BloomaValidationModes.Aggressive"
			:debounce="250"
			:showLabel="true"
			:val$="v$.fieldType"
			:list="ContactCustomFieldTypes"
			:modelValue="form.fieldType"
			@update:modelValue="updateFieldType"
		)
	div.field
		div
			label.label.dummy-label &nbsp;
			div.del-container
				BButton.is-rounded.is-large.del-btn(:type="BloomaTypes.Ghost" @click="deleteField")
					span.icon
						Icon(icon="iconoir:delete-circle" width="26")
			div.hr
				hr

</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints

$field-gap: 10px;

.field-row {
	display: grid; 
	grid-auto-columns: 1fr;
	grid-auto-flow: column;
	gap: 0px $field-gap;
	height: 100%; 
	width: 100%;
}

.label {
	font-size: 0.9rem;
	font-weight: 500;
	margin-bottom: 4px;
	color: #03363e;
}

.del-container {
	display: flex;
	justify-content: start;
	align-items: center;
	margin-left: 10px;
	margin-right: 10px;
}

.del-btn.button > .icon {
	color: $red;
}

.del-btn.button {
	padding: 0;
	// margin-left: $field-gap;
	height: auto;
}

.del-btn.button:focus {
	box-shadow: none;
}
.del-btn.button:hover {
	box-shadow: none;
}

.hr {
	display: flex;
	justify-content: center;
	align-items: center;

	hr {
		width: 100%;
		height: 1px;
	}
}

@media screen and (max-width: $tablet) {
	.field-row {
		grid-auto-flow: row;
	}

	.del-container {
		justify-content: center;
	}

	.dummy-label {
		display: none;
	}
}
</style>