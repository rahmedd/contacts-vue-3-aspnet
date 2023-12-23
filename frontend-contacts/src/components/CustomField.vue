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

</script>

<template lang="pug">
div.field-row(@change="updateField")
	div.field
		BInput(
			placeholder="Label"
			name="fieldname"
			v-model="form.fieldName"
			:debounce="250"
			:showLabel="true"
			:val$="v$.fieldName"
		)
	div.field
		BInput(
			placeholder="Value"
			name="fieldvalue"
			v-model="form.fieldValue"
			:debounce="250"
			:showLabel="true"
			:val$="v$.fieldValue"
			:date="form.fieldType === ContactCustomFieldTypes.DATE"
		)
	div.field(v-if="!simple")
		BSelect.field-is-small(
			placeholder="Type"
			name="fieldtype"
			v-model="form.fieldType"
			:mode="BloomaValidationModes.Aggressive"
			:debounce="250"
			:showLabel="true"
			:val$="v$.fieldType"
			:list="ContactCustomFieldTypes"
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