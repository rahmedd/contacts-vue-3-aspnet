<script setup lang="ts">
import { ref, unref } from 'vue';
import { useRouter } from 'vue-router'
import { useAxios } from '@vueuse/integrations/useAxios'
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import {
	object as zobject,
	string as zstring
} from 'zod';

import apiClient from '@/services/axios';
import { useAuthStore } from '@/stores/auth'

import type BaseReponse from '@/responseTypes/BaseResponse';
import type User from '@/responseTypes/User';
import LoginRequest from '@/requestTypes/LoginRequest';
import { BloomaTypes } from '@/blooma/enums/BloomaTypes';

import BInput from '@/blooma/BInput.vue'
import BButton from '@/blooma/BButton.vue'
import LoginForm from '@/components/LoginForm.vue'

const router = useRouter()
const authStore = useAuthStore()

const formSchema = toTypedSchema(zobject({
	username: zstring()
		.nonempty({ message: 'Required' })
	,
	password: zstring()
		.nonempty({ message: 'Required' })
		// .min(12, { message: 'Passsword must be at least 12 characters long' })
	,
}))

const formValue = ref<LoginRequest>({
	username: '',
	password: ''
})

const { errors, validate, submitForm } = useForm<LoginRequest>({
	validationSchema: formSchema
})

const {
	data: loginRes,
	isFinished: loginFinished,
	execute: loginSendRequest,
} = useAxios<BaseReponse<User>>('Auth/Login', { method: 'POST' }, apiClient, { immediate: false })

async function submitLogin(evt: Event) {
	evt.preventDefault()

	try {
		const validationRes = await validate()
		if (!validationRes.valid) {
			return
		}

		await submitForm()
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

		if (!res.success || !res.body) {
			authStore.login(false, res.body)

			return
		}
		authStore.login(true, res.body)

		router.push('/contact')
	}
	catch (ex) {
		console.log('Error: submitLogin request failed')
		console.log(ex)
	}
}
</script>

<template lang="pug">
LoginForm
	.login-container
		h1.login-title Log in
		BInput#username(class="login-input" placeholder='Username' name='username' v-model='formValue.username')
		BInput#password(placeholder='Password' name='password' v-model='formValue.password')
		.field
			BButton(:type="BloomaTypes.Primary" @click="submitLogin").login-btn Log in
		.login-button-container
			BButton.login-signup-link(:type="BloomaTypes.Ghost" @click='$router.push("/signup")') Sign Up
			BButton.login-signup-link(:type="BloomaTypes.Ghost" @click='$router.push("/demo")') Demo
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints

.login-container {
	height: 100%;
	width: 500px;
	display: flex;
	flex-direction: column;
	margin: 0 auto;
}

.login-title {
	font-size: 2rem;
	font-weight: 600;
	margin-bottom: 0.5em;
}

.login-btn {
	width: 100%;
}

.login-signup-link {
	color: $bl-link;
}
.login-button-container {
	display: flex;
	// flex-direction: column;
	justify-content: space-between;
	// margin-top: 1em;

	.button {
		margin-bottom: 1em;
		padding: 0;
	}

	.button:last-child {
		margin-bottom: 0;
	}
}

@media screen and (max-width: $tablet) {
	.login-container {
		width: 350px;
	}
}
</style>