<script setup lang="ts">
import { computed, isRef, ref, unref } from 'vue';
import { useAxios } from '@vueuse/integrations/useAxios'
import apiClient from '@/services/axios';

import type BaseReponse from '@/responseTypes/BaseResponse';
import type LoginResponse from '@/responseTypes/LoginResponse';
import LoginRequest from '@/requestTypes/LoginRequest';
import { BloomaTypes } from '@/blooma/enums/BloomaTypes';
import BInput from '@/blooma/BInput.vue'
import BCard from '@/blooma/BCard.vue'
import BButton from '@/blooma/BButton.vue'
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


const showModal = ref(true)
const classObject = computed(() => ({
	'is-active': showModal.value
}))

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
.modal(
	:class="classObject"
)
	.modal-background
	.modal-content
		.card
			.card-content
				.content
					h2.login-title Login
					h5(style="text-align: center;") Hey, Enter your details to get signed into your account
				BInput#username(class="login-input" placeholder='Username' name='username' v-model='formValue.username')
				BInput#password(placeholder='Password' name='password' v-model='formValue.password')
				p Having trouble signing in?
				BButton(:type="BloomaTypes.Primary").login-btn Sign in
				p Don't have an account? Signup Now


</template>

<style lang="scss" scoped>
.card-content {
	padding: 3.5rem;
}
.card-footer {
	border-top: none;
}

.card {
	border-radius: 2rem;
}

.signup-now {
	display: flex;
	flex-direction: column;
}

.login-title {
	text-align: center;
	font-weight: 700;
}

.login-btn {
	width: 100%;
	font-weight: 700;
}

.modal-background {
	background: #f5f2ea;
}

// .login-input {
// 	input {
// 		height: 2.8em;
// 		box-shadow: none;
// 	}
// }

.card {
	box-shadow: none;
}
.modal-content {
	box-shadow: 5px 5px 20px gainsboro;
	border-radius: 50px;
}
</style>