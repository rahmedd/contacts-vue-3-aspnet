<script setup lang="ts">
import { computed, type PropType } from 'vue';
import { BloomaTypes } from '@/blooma/enums/BloomaTypes';
import { boolean } from 'zod';

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
	}
})

const classObject = computed(() => {
	const classes = ['button']
	classes.push(props.type)

	if (props.light) {
		classes.push('is-light')
	}

	return classes
})

</script>

<template lang="pug">
button(:class="classObject" type="button" :disabled="disabled")
	slot
</template>

<style lang="sass" scoped>

</style>