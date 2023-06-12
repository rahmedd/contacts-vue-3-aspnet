<script setup lang="ts">
import { type PropType } from 'vue';
import { FullmoonTypes } from '@/fullmoon/FullmoonTypes';

const props = defineProps({
	disabled: {
		type: Boolean,
		default: false
	},
	type: {
		type: String as PropType<FullmoonTypes>,
		validator: (value: FullmoonTypes) => Object.values(FullmoonTypes).includes(value)
	},
})

</script>

<template lang="pug">
button(class="btn" :class="type" type="button" :disabled="disabled")
	slot
</template>

<style lang="sass" scoped>

</style>