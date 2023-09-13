<script setup lang="ts">
import { ref, type PropType, onMounted, computed } from 'vue';
import BButton from '@/blooma/BButton.vue';

// const props = defineProps({})
// const emits = defineEmits<{}>()

const open = ref<boolean>(true)
</script>

<template lang="pug">
Teleport(to="body")
	//- div.b-modal.modal(v-if="open")
	//- 	p modal
	//- 	BButton(@click="open = false") Close
	.modal(:class="{ 'is-active': open }")
		.modal-background
		.modal-card
			header.modal-card-head
				slot(name="header")
				//- p.modal-card-title Modal title
				//- button.delete(aria-label='close')
			section.modal-card-body
				slot(name="content")
			footer.modal-card-foot
				slot(name="footer")
				//- button.button.is-success Save changes
				//- button.button Cancel

</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints

</style>