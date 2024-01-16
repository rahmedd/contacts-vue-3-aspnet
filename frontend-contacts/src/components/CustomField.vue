<script setup lang="ts">
import { reactive, type PropType } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { customValidatorBase } from '@/validation/customValidatorBase'
import { validators } from '@/validation/customFieldValidators'

import { BloomaValidationModes } from '@/blooma/enums/BloomaValidationModes'
import { BloomaSizes } from '@/blooma/enums/BloomaSizes'

import type { ContactCustomField } from '@/requestTypes/ContactCustomField'
import BaseReponse from '@/responseTypes/BaseResponse'
import { ContactCustomFieldTypes } from "@/enums/ContactCustomFieldTypes"

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
// const dynamicRule = (param: any) =>
// 	helpers.withParams(
// 		{ type: 'contains', value: param },
// 		(value) => {
// 			console.log('hello')
// 			console.log(siblings)
// 			return !helpers.req(value) || value.includes(param)
// 		}
// 	)

function fieldTypeValidator(fieldValue: string, field: ContactCustomField): BaseReponse<null> {
	console.log('ftvalidator')
	console.log(fieldValue)
	console.log(field)

	const fieldType = field.fieldType
	
	if (fieldType === ContactCustomFieldTypes.DATE) {
		const date = new Date(fieldValue)
		const isDate: boolean = !isNaN(date.getFullYear())
		return new BaseReponse(isDate, 'Invalid date', null)
	}

	else if (fieldType === ContactCustomFieldTypes.EMAIL) {
		const re = /\S+@\S+\.\S+/;
		const res: boolean = re.test(fieldValue)
		return new BaseReponse(res, 'Invalid email', null)
	}

	else if (fieldType === ContactCustomFieldTypes.PHONE) {
		const re = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
		const res: boolean = re.test(fieldValue)
		return new BaseReponse(res, 'Invalid phone', null)
	}

	else if (fieldType === ContactCustomFieldTypes.SECRET) {
		return new BaseReponse(true, '', null)
	}

	else if (fieldType === ContactCustomFieldTypes.TEXT) {
		return new BaseReponse(true, '', null)
	}

	else {
		console.log('fieldTypeValidator: error invalid field type')
		return new BaseReponse(false, 'internal error', null)
	}
}

const vali = (val: any, field: any) => {
	console.log('vali')
	console.log(field)
	return true
}
// const asyncValidator = helpers.withAsync(fieldTypeValidator, () => props.field.fieldType)
const asyncValidator = helpers.withAsync(
	customValidatorBase(fieldTypeValidator),
	() => props.field.fieldType
)

const rules = {
	fieldName: { isRequired, },
	fieldType: { isRequired, },
	fieldValue: {
		isRequired,
		dynRule: asyncValidator,
		// dynRule: customValidatorBase(fieldTypeValidator, () => props.field.fieldType),
		// dynRule: helpers.withParams({}, fieldTypeValidator)
	},
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
			:date="form.fieldType === ContactCustomFieldTypes.DATE"
			:modelValue="form.fieldValue"
			@update:modelValue="updateFieldValue"
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
			@update:modelValue="updateFieldType"
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