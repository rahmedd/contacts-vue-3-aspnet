<script setup lang="ts">
import { type FormInst, NForm, NFormItem, NInput, NButton, NCard } from 'naive-ui'
import { computed, isRef, ref, unref } from 'vue';
import { useAxios } from '@vueuse/integrations/useAxios'
import apiClient from '@/services/axios';

import { NaiveButtonTypes } from '../enums/NaiveButtonTypes';
import { NaiveTriggerTypes } from '@/enums/NaiveTriggerTypes';
import type BaseReponse from '@/responseTypes/BaseResponse';
import type LoginResponse from '@/responseTypes/LoginResponse';
import LoginRequest from '@/requestTypes/LoginRequest';

const formRef = ref<FormInst | null>(null)
const formValue = ref<LoginRequest>({
	username: 'testuser',
	password: 'b'
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
	isFinished: loginFinished,
	execute: loginSendRequest,
} = useAxios<BaseReponse<LoginResponse>>('Auth/Login', { method: 'POST' }, apiClient, { immediate: false })

// const inputFeedback = computed(() => {
// 	if (!loginRes.value?.success && loginRes.value?.message) {
// 		return loginRes.value.message
// 	}
// })

// const inputValidationStatus = computed(() => {
// 	// If request not complete or success
// 	if (!loginRes.value) {
// 		return undefined
// 	}

// 	if (loginRes.value.success) {
// 		return 'success' // Does nothing?
// 	}

// 	return 'error'
// })

// const passwordFeedback = computed(() => {
// 	if (!loginRes.value) {
// 		return
// 	}

// 	if (!formValue.value.password) {
// 		return 'Cannot be empty'
// 	}
// })

async function submitLogin(evt: Event) {
	try {
		evt.preventDefault()
		await formRef.value?.validate()
	}
	catch (errors) {
		console.log('Error: submitLogin validation failed')
		return
	}

	try {
		const { data } = await loginSendRequest({
			data: {
				Username: formValue.value.username,
				Password: formValue.value.password
			}
		})

		const res = unref(data)!

		if (!res.success) {
			
		}
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
						NInput(v-model:value="formValue.password" placeholder="Password" @keyup.enter="submitLogin" type="password" show-password-on="mousedown" :maxlength="8")
				template(#footer)
					div.login-error
						span(v-if="loginRes?.success === false") {{ loginRes?.message }}
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

.login-error {
	height: 32px;
	// background: red;
	// color: white;
	color: red;
	text-align: center;
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