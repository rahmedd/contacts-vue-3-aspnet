<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
	<RouterView class="app-background" />
</template>

<style lang="scss">
@import '@/blooma/vars.scss';
/* * { outline: 1px solid red; } */
*::-webkit-scrollbar {
  width: 6px;               /* width of the entire scrollbar */
}

*::-webkit-scrollbar-track {
  background: $bl-primary-light;
}

*::-webkit-scrollbar-thumb {
  background-color: gainsboro;    /* color of the scroll thumb */
  border-radius: 4px;       /* roundness of the scroll thumb */
  border: none;
}

.app-background {
	background: $bl-background;
}
</style>
