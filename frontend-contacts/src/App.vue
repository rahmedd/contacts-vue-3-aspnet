<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { NConfigProvider } from 'naive-ui'

</script>

<template>
	<NConfigProvider>
		<RouterView />
	</NConfigProvider>
</template>

<style scoped>

</style>
