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
	div.field-small(v-if="!simple")
		BSelect.field-small(
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
		.fake-field.field-small
			label.label &nbsp;
			div
				BButton.is-rounded.is-large.del(:type="BloomaTypes.Ghost" @click="deleteField")
					span.icon
						Icon(icon="typcn:delete" width="30")

</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints

$field-gap: 10px;

.field-row {
	display: flex;
}

.field {
	width: 240px;
}

.field-small {
	width: 125px;
}

.field, .field-small:not(:last-child) {
	margin-right: $field-gap;
}


.fake-field:has(.input.is-small) {
	height: 75px;
}

.fake-field:has(.input.is-default) {
	height: 85px;
}

.label {
	font-size: 0.9rem;
	font-weight: 500;
	margin-bottom: 4px;
	color: #03363e;
}

.del.button > .icon {
	color: $red;
}

.del.button {
	padding: 0;
	margin-left: $field-gap;
	height: auto;
}

.del.button:focus {
	box-shadow: none;
}
.del.button:hover {
	box-shadow: none;
}

</style>