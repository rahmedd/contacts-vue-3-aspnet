<script setup lang="ts">
import BForm from '@/blooma/BForm.vue';

const props = defineProps({
	loading: {
		type: Boolean,
		default: false
	},
})

</script>

<template lang="pug">
.hero.is-fullheight
	.hero-body
		.container
			BForm(:loading="loading")
				slot
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints
.hero {
	background: $bl-background-secondary;
}

.hero-body {
	background: $bl-background;
	width: $tablet;
	// box-shadow: 5px 5px 20px gainsboro;
	box-shadow: 0px 5px 20px rgb(0 0 0 / 10%);
}

@media screen and (max-width: $tablet) {
	.hero-body {
		width: 100%;
		padding: 0;
	}
}
</style>