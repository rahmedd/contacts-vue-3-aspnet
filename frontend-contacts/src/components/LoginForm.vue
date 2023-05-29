<!-- <script setup lang="ts">
import { type FormInst, NForm, NFormItem, NInput, NButton } from 'naive-ui'
import { ref } from 'vue';
import { NaiveButtonTypes } from '@/Enums/NaiveButtonTypes';
import { NaiveTriggerTypes } from '@/Enums/NaiveTriggerTypes';

const formRef = ref<FormInst | null>(null)
const formValue = ref({
	username: '',
	password: ''
})

const rules = {
	username: {
		required: true,
		message: 'Username required',
		trigger: NaiveTriggerTypes.Blur
	},
	password: {
		required: true,
		message: 'Password required',
		trigger: NaiveTriggerTypes.Blur
	},
}

async function submitLogin(e: any) {
	e.preventDefault()
	console.log('submitted!')
}

</script>

<template lang="pug">
NForm(ref="formRef" :model="formValue" :rules="rules")
	NFormItem(label="Username" path="username")
		NInput(v-model:value="formValue.username" placeholder="Username")
	NFormItem(label="Password" path="password")
		NInput(v-model:value="formValue.password" placeholder="Password")
	NButton(:type="NaiveButtonTypes.Primary" @click="submitLogin") Login
</template>

<style lang="sass" scoped>

</style> -->