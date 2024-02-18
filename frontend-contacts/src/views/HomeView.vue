<script setup lang="ts">
import { useRouter } from 'vue-router'

import { BloomaTypes } from '@/blooma/enums/BloomaTypes';

import BButton from '@/blooma/BButton.vue'

const router = useRouter()
</script>

<template lang="pug">
section.has-background-warning-light
	nav.navbar.has-background-warning-light.py-5.is-relative
		.container.is-fluid
			.navbar-brand.is-justify-content-space-between
				a.navbar-item.pl-0.title.is-size-4.mb-0(href='#')
					//- img(src='logo.svg' alt='' width='132')
				//- button.button.is-ghost.is-hidden-desktop.navbar-menu-open
				//- 	svg(width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg')
				//- 		path(fill-rule='evenodd' clip-rule='evenodd' d='M3.5 7C3.22386 7 3 6.77614 3 6.5C3 6.22386 3.22386 6 3.5 6H20.5C20.7761 6 21 6.22386 21 6.5C21 6.77614 20.7761 7 20.5 7H3.5ZM3.5 12C3.22386 12 3 11.7761 3 11.5C3 11.2239 3.22386 11 3.5 11H20.5C20.7761 11 21 11.2239 21 11.5C21 11.7761 20.7761 12 20.5 12H3.5ZM3 16.5C3 16.7761 3.22386 17 3.5 17H20.5C20.7761 17 21 16.7761 21 16.5C21 16.2239 20.7761 16 20.5 16H3.5C3.22386 16 3 16.2239 3 16.5Z' fill='#006251')
			.navbar-menu
				.navbar-start
					//- a.navbar-item(href='#') About
					//- a.navbar-item(href='#') Company
					//- a.navbar-item(href='#') Services
					//- a.navbar-item(href='#') Testimonials
				.navbar-end.is-block-desktop.is-hidden-touch
					BButton(:type="BloomaTypes.Warning" @click='$router.push("/login")') Login
					//- a.button.is-warning(@click="$router.push("/signup")") Login
	.section.pt-0
		.container.mt-8
			.mb-12.is-vcentered.columns.is-multiline.is-align-items-center
				.column.is-12.is-6-desktop.mb-20.mb-0-desktop
					.has-mw-md-desktop
						h2.title.is-size-2.is-spaced.has-text-primary.mb-5 Contacts
						p.subtitle.mb-6
							| A contacts app written in Vue 3 and ASP.NET.
						.buttons
							BButton(:type="BloomaTypes.Primary" @click='$router.push("/demo")') Demo
							BButton(:type="BloomaTypes.Dark" @click='$router.push("/signup")') Sign Up
							//- a.button.is-primary(href='#') Sign up
							//- a.button.is-dark(href='#') Log in
				//- .column.is-12.is-6-desktop
					//- img.image.is-fullwidth(src='example-scene.png' alt='')
			//- .has-text-centered
				//- a.has-text-warning.is-size-6(href='#')
					//- svg.mb-2(width='9' height='12' viewBox='0 0 9 12' fill='none' xmlns='http://www.w3.org/2000/svg')
					//- 	path(d='M5 10.2929L8.14645 7.14645C8.34171 6.95118 8.65829 6.95118 8.85355 7.14645C9.04882 7.34171 9.04882 7.65829 8.85355 7.85355L4.85355 11.8536C4.65829 12.0488 4.34171 12.0488 4.14645 11.8536L0.146447 7.85355C-0.0488155 7.65829 -0.0488155 7.34171 0.146447 7.14645C0.341709 6.95118 0.658291 6.95118 0.853553 7.14645L4 10.2929V0.5C4 0.223858 4.22386 0 4.5 0C4.77614 0 5 0.223858 5 0.5V10.2929Z' fill='currentColor')
					//- span.is-block Scroll to see benefits
	//- .is-hidden.navbar-side.is-fixed.is-top-0.is-bottom-0.is-left-0.has-mw-sm(style='width: 75%; z-index: 9999;')
	//- 	.navbar-backdrop.is-fixed.is-inset-0.has-background-primary(style='opacity: 90%;')
	//- 	nav.navbar.is-light.is-relative.is-flex.is-flex-direction-column.px-6.py-6.has-background-white(style='width: 100%; height: 100%; overflow-y: auto')
	//- 		.mb-10.navbar-brand
	//- 			a.navbar-item.mr-auto.title.is-size-4.pl-0(href='#')
	//- 				//- img(src='logo.svg' alt='' width='132')
	//- 			button.navbar-close.button.is-text.p-0.mb-2(type='button' aria-label='Close')
	//- 				svg(style='width: 18px; height: 18px;' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor')
	//- 					path(stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12')
			div
				.is-flex-direction-column
					//- a.navbar-item.mb-4.has-text-grey-dark(href='#') About
					//- a.navbar-item.mb-4.has-text-grey-dark(href='#') Company
					//- a.navbar-item.mb-4.has-text-grey-dark(href='#') Services
					//- a.navbar-item.mb-4.has-text-grey-dark(href='#') Testimonials
			.mt-auto
				.py-6
					a.button.is-primary.is-fullwidth(href='#') Contact Us
				p.is-size-7.mb-4.has-text-centered © 2024 All rights reserved.
</template>
