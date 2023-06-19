<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template lang="pug">
span contact
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints
</style>