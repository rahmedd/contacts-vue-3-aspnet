<script setup lang="ts">
import { useRouter } from 'vue-router'

import { BloomaTypes } from '@/blooma/enums/BloomaTypes';

import BButton from '@/blooma/BButton.vue'

const router = useRouter()
</script>

<template lang="pug">
div.home.has-background-success-light
	.n-bar
		BButton(:type="BloomaTypes.Ghost" @click='$router.push("/signup")') sign up
		BButton(:type="BloomaTypes.Ghost" @click='$router.push("/login")') login
	div.content.has-background-success-light
		h2.title.is-size-2.is-spaced.has-text-primary Contacts
		p.subtitle.mb-6
			| A contacts app written in Vue 3 and ASP.NET.
		.button-bar
			BButton(:type="BloomaTypes.Primary" @click='$router.push("/demo")') Demo
			//- div.or
			//- 	span or
			BButton(:type="BloomaTypes.Info" @click='$router.push("/signup")') Sign Up
			BButton(:type="BloomaTypes.Default" @click='$router.push("/login")') Login
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints

.home {
	height: 100dvh;
}

.content {
	margin: 6rem;
}

.or {
	margin: 1rem;
	text-align: center;
}

.n-bar {
	display: flex;
	align-items: baseline;
	justify-content: end;
}

.button-bar {
	display: flex;
	align-items: baseline;
	* {
		margin-right: 1.5rem;
	}
}

@media screen and (max-width: $tablet) {
	.content {
		margin: 1rem;

		.title {
			margin-top: 30%;
		}

		.subtitle {

		}

		.button-bar {
			flex-direction: column;

			.button {
				width: 100%;
			}

			* {
				margin-bottom: 1rem;
			}
		}
	}
}
</style>