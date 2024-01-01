<script setup lang="ts">
import { reactive, type PropType } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'

import type { ContactCustomField } from '@/requestTypes/ContactCustomField'
import { BloomaValidationModes } from '@/blooma/enums/BloomaValidationModes'
import { BloomaSizes } from '@/blooma/enums/BloomaSizes'
import { ContactCustomFieldTypes } from "@/enums/ContactCustomFieldTypes"
// import { MappingEnum } from '@/types/MappingEnum'

import BInput from '@/blooma/BInput.vue'
import BSelect from '@/blooma/BSelect.vue'

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
}>()

const form = reactive<ContactCustomField>({ ...props.field })

const isRequired = helpers.withMessage('Required', required)
const rules = {
	fieldName: { isRequired, },
	fieldType: { isRequired, },
	fieldValue: { isRequired, },
}

const v$ = useVuelidate(rules, form)

function updateField() {
	emits('update', { ...form })
}

const fieldTypes = Object.keys(ContactCustomFieldTypes).filter((v) => isNaN(Number(v)));

// const mapping = {
// 	[ContactCustomFieldTypes.TDATE]: 'Date',
// 	[ContactCustomFieldTypes.TSTRING]: 'Text',
// }

function updateFieldName(evt: Event) {
	const val = (evt.target as HTMLInputElement).value
	form.fieldName = val
	updateField()
}

function updateFieldValue(evt: Event) {
	const val = (evt.target as HTMLInputElement).value
	form.fieldValue = val
	updateField()
}

function updateFieldType(evt: Event) {
	const val = (evt.target as HTMLInputElement).value
	form.fieldType = val
	updateField()
}

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
			@input="updateFieldName"
		)
	div.field
		BInput(
			placeholder="Value"
			name="fieldvalue"
			:debounce="250"
			:showLabel="true"
			:val$="v$.fieldValue"
			:date="form.fieldType === ContactCustomFieldTypes.DATE"
			:modelValue="form.fieldValue"
			@input="updateFieldValue"
		)
	div.field(v-if="!simple")
		BSelect.field-is-small(
			placeholder="Type"
			name="fieldtype"
			:mode="BloomaValidationModes.Aggressive"
			:debounce="250"
			:showLabel="true"
			:val$="v$.fieldType"
			:list="ContactCustomFieldTypes"
			:modelValue="form.fieldType"
			@input="updateFieldType"
		)

</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints

.field-row {
	display: flex;
}

.field {
	width: 240px;
}

.field-is-small {
	width: 125px;
}

.field:not(:last-child) {
	margin-right: 10px;
}

</style>