<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue';

import { BloomaValidationModes } from '@/blooma/enums/BloomaValidationModes'

import { ContactSearchModes } from '@/enums/ContactSearchModes'

import BInput from '@/blooma/BInput.vue'

const props = defineProps({
	modelValue: String,
	searchMode: {
		type: Number as PropType<ContactSearchModes>,
		required: true,
	},
})

const emits = defineEmits([
	'update:modelValue',
	'update:searchMode',
])

const searchQuery = ref<string>('')

function updateMode() {
	emits('update:searchMode', ContactSearchModes.SEARCH)
}

function updateModel() {
	emits('update:modelValue', searchQuery.value)
}

function setSearchQuery(val: string) {
	searchQuery.value = val
	updateMode()
	updateModel()
}

watch(() => props.searchMode, () => {
	if (props.searchMode === ContactSearchModes.ALPHA) {
		searchQuery.value = ''
	}
})
</script>

<template lang="pug">
BInput(
	placeholder='Search'
	name='search'
	:modelValue="searchQuery"
	@update:modelValue="setSearchQuery"
	:mode="BloomaValidationModes.Aggressive"
	:showLabel="false"
	:debounce="250"
)
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints

</style>