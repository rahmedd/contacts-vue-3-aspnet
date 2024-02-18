<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ContactView from '@/views/ContactView.vue'

const authStore = useAuthStore()

onBeforeMount(() => {
	authStore.setDemo(true)
})
</script>

<template lang="pug">
div
	div.demo-banner-container
		div.demo-banner
			span.demo-banner demo mode
	ContactView
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints

.demo-banner {
	display: flex;
	justify-content: center;
	align-items: center;
	color: black;
	background: $yellow;
	height: 16px;
	font-size: 12px;
}

.demo-banner-container {
	position: absolute;
	z-index: 1;
	opacity: 0.5;
	pointer-events: none;
	width: 100%;
}
</style>