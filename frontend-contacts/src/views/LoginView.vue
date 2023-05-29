<script setup lang="ts">
import { type FormInst, NForm, NFormItem, NInput, NButton, NCard } from 'naive-ui'
import { ref } from 'vue';
import { useAxios } from '@vueuse/integrations/useAxios'
import apiClient from '@/services/axios';

import { NaiveButtonTypes } from '../enums/NaiveButtonTypes';
import { NaiveTriggerTypes } from '@/enums/NaiveTriggerTypes';
import type BaseReponse from '@/responseTypes/BaseResponse';
import type LoginRes from '@/responseTypes/LoginRes';
import LoginReq from '@/requestTypes/LoginReq';

const formRef = ref<FormInst | null>(null)
const formValue = ref<LoginReq>({
	username: 'testuser',
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

const {
	data: loginRes,
	isFinished: loginIsFinished,
	execute: loginSendRequest,
} = useAxios<BaseReponse<LoginRes>>('Auth/Login', { method: 'POST' }, apiClient, { immediate: false })

async function submitLogin(evt: Event) {
	try {
		evt.preventDefault()
		// const res = formRef.value?.validate((errors) => {
		// 	if (!errors) {
		// 		console.log('submitted!')
		// 	}
		// 	else {
		// 		console.log(errors)
		// 	}
		// })
		// res?.then(x => x).catch(y => y)
		// const res = await formRef.value?.validate((errors) => {
		// 	if (!errors) {
		// 		console.log('submitted!')
		// 	}
		// 	else {
		// 		console.log(errors)	
		// 	}
		// })
		await formRef.value?.validate()
	}
	catch (errors) {
		console.log('Error: submitLogin validation failed')
		return
	}

	try {
		const res = await loginSendRequest({
			data: {
				Username: formValue.value.username,
				Password: formValue.value.password
			}
		})

		console.log(loginRes.value?.body.id)
	}
	catch (ex) {
		console.log('Error: submitLogin request failed')
		console.log(ex)
	}

	
}

</script>

<template lang="pug">
div.login-page-vertical
	div.login-page-horizontal
		div.login-card
			NCard
				template(#header)
					h2.login-title Login
				NForm(ref="formRef" :model="formValue" :rules="rules")
					NFormItem(label="Username" path="username")
						NInput(v-model:value="formValue.username" placeholder="Username" @keyup.enter="submitLogin")
					NFormItem(label="Password" path="password")
						NInput(v-model:value="formValue.password" placeholder="Password" @keyup.enter="submitLogin")
				template(#action)
					div.button-bar
						div.button-bar-align
							NButton(:type="NaiveButtonTypes.Default" @click="submitLogin") Sign Up
							NButton(:type="NaiveButtonTypes.Primary" @click="submitLogin") Login
</template>

<style lang="scss" scoped>
.login-page-vertical {
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100vh;
	background: #fafafc;
}
.login-page-horizontal {
	display: flex;
	justify-content: center;
}
.login-card {
	width: 512px;
	box-shadow: 5px 5px 20px gainsboro
}
.login-title {
	margin: 0;
}
.button-bar {
	display: flex;
	justify-content: end;
}
.button-bar-align {
	button {
		margin-left: 16px;
	}
}
</style>