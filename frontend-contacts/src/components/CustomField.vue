<script setup lang="ts">
import { reactive, type PropType } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'

import type { ContactCustomField } from '@/requestTypes/ContactCustomField'
import { BloomaValidationModes } from '@/blooma/enums/BloomaValidationModes'
import { BloomaSizes } from '@/blooma/enums/BloomaSizes'

import BInput from '@/blooma/BInput.vue'

const props = defineProps({
	field: {
		type: Object as PropType<ContactCustomField>,
		required: true,
	},
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
	console.log('updated')
	emits('update', { ...form })
}

</script>

<template lang="pug">
div(@input="updateField")
	BInput(placeholder="Field Name" :name="`fieldname`" v-model="form.fieldName" :mode="BloomaValidationModes.Aggressive" :debounce="250" :showLabel="false" :size="BloomaSizes.Small" :val$="v$.fieldName")
	BInput(placeholder="Field Value" :name="`fieldvalue`" v-model="form.fieldValue" :mode="BloomaValidationModes.Aggressive" :debounce="250" :showLabel="false" :val$="v$.fieldValue")

</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints

</style>