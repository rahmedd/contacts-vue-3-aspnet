<script setup lang="ts">
import { reactive, ref, unref } from 'vue';
import { useRouter } from 'vue-router'
import { useAxios } from '@vueuse/integrations/useAxios'
import apiClient from '@/services/axios';
import { useAuthStore } from '@/stores/auth'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
// import { useBForm } from '@/blooma/composables/useBForm';

import type BaseReponse from '@/responseTypes/BaseResponse';
import type User from '@/responseTypes/User';
import type LoginRequest from '@/requestTypes/LoginRequest';
import { BloomaTypes } from '@/blooma/enums/BloomaTypes';


import BInput from '@/blooma/BInput.vue'
import BButton from '@/blooma/BButton.vue'
import LoginForm from '@/components/LoginForm.vue'


const router = useRouter()
const authStore = useAuthStore()

const form = reactive<LoginRequest>({
	username: '',
	password: '',
})

const rules = {
	username: { required, email },
	password: { required },
}

const v$ = useVuelidate(rules, form)


const {
	data: loginRes,
	execute: loginSendRequest, 
	isLoading: isLoading,
	isFinished: isFinished,
} = useAxios<BaseReponse<User>>('Auth/Login', { method: 'POST' }, apiClient, { immediate: false })

async function submitLogin(evt: Event) {
	evt.preventDefault()

	try {
		const vres = await v$.value.$validate()
		const field = v$.value.username
		type abc = typeof field
		console.log(field)

		// console.log(vres)

		if (!vres) {
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
				Username: form.username,
				Password: form.password,
			}
		})

		const res = unref(data)!

		if (!res.success || !res.body) {
			authStore.login(false, res.body)
			// setFieldError('password', 'Incorrect username or password')
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
LoginForm(:loading="isLoading" @keyup.enter="submitLogin")
	.login-container
		h1.login-title Log in
		BInput#username(class='login-input' placeholder='Username' name='username' v-model='form.username' :validator="v$.username")
		BInput#password(placeholder='Password' name='password' v-model='form.password' :validator="v$.password")

		.field
			BButton.login-btn(:type="BloomaTypes.Primary" @click="submitLogin" :action="true") Log in
			//- BButton.login-btn(:type="BloomaTypes.Primary" @click="validate" :action="true") Validate
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
</style>@/blooma/composables/useBForm