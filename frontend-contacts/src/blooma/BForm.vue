<script setup lang="ts">
import { provide, computed } from 'vue'
import { FormLoadingKey } from '@/blooma/symbols';

const props = defineProps({
	loading: {
		type: Boolean,
		default: false
	},
})

const comp = computed(() => props.loading)
provide(FormLoadingKey, comp) // reactive
</script>

<template lang="pug">
div.b-form
	slot
</template>

<style lang="sass" scoped>

</style>