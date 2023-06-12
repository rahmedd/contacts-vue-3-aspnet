<script setup lang="ts">
import { computed, isRef, ref, unref } from 'vue';
import { useAxios } from '@vueuse/integrations/useAxios'
import apiClient from '@/services/axios';

import type BaseReponse from '@/responseTypes/BaseResponse';
import type LoginResponse from '@/responseTypes/LoginResponse';
import LoginRequest from '@/requestTypes/LoginRequest';
import { FullmoonTypes } from '@/fullmoon/FullmoonTypes'
import FButton from '@/fullmoon/FButton.vue'
import FCard from '@/fullmoon/FCard.vue'
import FInput from '@/fullmoon/FInput.vue'
import { configure, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import {
	object as zobject,
	string as zstring
} from 'zod';

const formSchema = toTypedSchema(zobject({
	username: zstring()
		.nonempty()
	,
	password: zstring()
		.nonempty()
		// .min(12, { message: 'Passsword must be at least 12 characters long' })
	,
}))

const formValue = ref<LoginRequest>({
	username: '',
	password: ''
})

const { errors, errorBag, validate } = useForm({
	validationSchema: formSchema
})

const {
	data: loginRes,
	isFinished: loginFinished,
	execute: loginSendRequest,
} = useAxios<BaseReponse<LoginResponse>>('Auth/Login', { method: 'POST' }, apiClient, { immediate: false })

async function submitLogin(evt: Event) {
	evt.preventDefault()

	try {
		const res = await validate()
		if (!res.valid) {
			return
		}
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
.login-page-vertical
	.modal-content
		a.btn.close(href='#' role='button' aria-label='Close')
			span(aria-hidden='true') ×
		h5.modal-title Sign in to your account
		form(action='...' method='...' @submit="submitLogin")
			.form-group
				label.required(for='Username') Username
				FInput#username(type='text' placeholder='Username' name='username' v-model='formValue.username')
			.form-group
				label.required(for='Password') Password
				FInput#username(type='text' placeholder='Password' name='password' v-model='formValue.password')
			input.btn.btn-primary.btn-block(type='submit' value='Sign in')
		.text-right.mt-10
			// text-right = text-align: right, margin-top: 1rem (10px)
			a.hyperlink(href='#modal-2') Forgot password?
			// hyperlink = used on regular links to remove anti-aliasing in dark mode
</template>

<style lang="scss" scoped>
// override halfmoon margin
.form-group {
	margin-bottom: 8px;
}
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
}
.login-title {
	font-size: 32px;
	font-weight: 500;
	// background: gainsboro;
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