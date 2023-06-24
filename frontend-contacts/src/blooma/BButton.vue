<script setup lang="ts">
import { computed, inject, type PropType } from 'vue';
import { FormLoadingKey } from '@/blooma/symbols';
import { BloomaTypes } from '@/blooma/enums/BloomaTypes';

const props = defineProps({
	disabled: {
		type: Boolean,
		default: false
	},
	type: {
		type: String as PropType<BloomaTypes>,
		default: BloomaTypes.Default,
		validator: (value: BloomaTypes) => Object.values(BloomaTypes).includes(value)
	},
	light: {
		type: Boolean,
		default: false
	},
	action: {
		type: Boolean,
		default: false
	},
})

const formLoading = inject(FormLoadingKey)

const classObject = computed(() => {
	return {
		button: true,
		[props.type]: props.type,
		[BloomaTypes.Light]: props.light,
		['is-loading']: formLoading?.value && props.action,
	}
})

const computedDisabled = computed(() => {
	if (props.disabled) {
		return true
	}

	if (formLoading?.value) {
		return true
	}

	return false
})

</script>

<template lang="pug">
button(type="button" :class="classObject" :disabled="computedDisabled")
	slot
</template>

<style lang="sass" scoped>

</style>