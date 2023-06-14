<script setup lang="ts">
import { ref, type PropType } from 'vue';
import { BloomaTypes } from '@/blooma/enums/BloomaTypes';

const props = defineProps({
	disabled: {
		type: Boolean,
		default: false
	},
	type: {
		type: String as PropType<BloomaTypes>,
		validator: (value: BloomaTypes) => Object.values(BloomaTypes).includes(value)
	},
})

</script>

<template lang="pug">
div.f-card
	div.f-card-header
		slot(name="header")
	div.f-card-content
		slot(name="content")
	div.f-card-footer
		slot(name="footer")
	//- div.f-card-action
	//- 	slot(name="action")
</template>

<style lang="scss" scoped>
.f-card-header {
	// grid-area: header;
	padding: 32px;
}
.f-card-content {
	// grid-area: main;
	padding: 32px;
}
.f-card-footer {
	// grid-area: sidebar;
	padding: 32px;
}
.f-card-action {
	// grid-area: footer;
	// padding: 16px;
}

.f-card {
	display: flex;
	flex-direction: column;
	border: 1px solid rgb(233, 233, 233);
	border-radius: 12px;
	background: #fafafc;
	box-shadow: 5px 5px 20px gainsboro
}


// .f-card-header {
// 	// grid-area: header;
// 	padding: 16px;
// }
// .f-card-content {
// 	// grid-area: main;
// 	padding: 16px;
// }
// .f-card-footer {
// 	// grid-area: sidebar;
// 	padding: 16px;
// }
// .f-card-action {
// 	// grid-area: footer;
// }

// .f-card {
// 	display: grid; 
// 	grid-template-columns: 1fr; 
// 	grid-template-rows: 64px 1fr 64px; 
// 	gap: 0px 0px; 
// 	grid-template-areas: 
// 		"."
// 		"."
// 		"."; 
// }
</style>