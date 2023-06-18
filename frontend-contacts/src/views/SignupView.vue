<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { RouterLink } from 'vue-router'
import { useAxios } from '@vueuse/integrations/useAxios'
import apiClient from '@/services/axios';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import {
	object as zobject,
	string as zstring
} from 'zod';
import type BaseReponse from '@/responseTypes/BaseResponse';
import type LoginResponse from '@/responseTypes/LoginResponse';
import SignupRequest from '@/requestTypes/SignupRequest';
import { BloomaTypes } from '@/blooma/enums/BloomaTypes';
import BInput from '@/blooma/BInput.vue'
import BButton from '@/blooma/BButton.vue'
import LoginForm from '@/components/LoginForm.vue'

const formSchema = toTypedSchema(
	zobject({
		username: zstring()
			.min(4, { message: 'Username must be at least 4 characters long' })
		,
		password: zstring()
			.min(8, { message: 'Passsword must be at least 8 characters long' })
		,
		confirmPassword: zstring()
			.min(8, { message: 'Passsword must be at least 8 characters long' })
			.refine(s => s === formValue.value.password, { message: 'Passwords do not match' })
		,
	})
)

const formValue = ref<SignupRequest>({
	username: '',
	password: '',
	confirmPassword: ''
})

const { errors, validate, submitForm } = useForm({
	validationSchema: formSchema
})

const {
	data: loginRes,
	isFinished: loginFinished,
	execute: loginSendRequest,
} = useAxios<BaseReponse<LoginResponse>>('Auth/Login', { method: 'POST' }, apiClient, { immediate: false })

async function submitSignup(evt: Event) {
	evt.preventDefault()

	try {
		// const res = await validate()
		// if (!res.valid) {
		// 	return
		// }

		await submitForm()
	}
	catch (errors) {
		console.log('Error: submitSignup validation failed')
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
		console.log('Error: submitSignup request failed')
		console.log(ex)
	}
}

</script>

<template lang="pug">
LoginForm
	.login-container
		h1.login-title Sign Up
		BInput#username(class="login-input" placeholder='Username' name='username' v-model='formValue.username')
		BInput#password(placeholder='Password' name='password' v-model='formValue.password')
		BInput#confirmPassword(placeholder='Confirm password' name='confirmPassword' v-model='formValue.confirmPassword')
		.field
			BButton(:type="BloomaTypes.Primary" @click="submitSignup").login-btn Sign Up
		.login-button-container
			BButton.login-signup-link(:type="BloomaTypes.Ghost" @click='$router.push("/login")') Login
			BButton.login-signup-link(:type="BloomaTypes.Ghost" @click='$router.push("/deno")') Demo
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "../node_modules/bulma/sass/utilities/initial-variables.sass"; // breakpoints

.login-container {
	height: 100%;
	width: 500px;
	display: flex;
	flex-direction: column;
	margin: 0 auto;
}

.hero {
	background: $bl-background-secondary;
}

.hero-body {
	background: $bl-background;
	width: $tablet;
	// box-shadow: 5px 5px 20px gainsboro;
	box-shadow: 0px 5px 20px rgb(0 0 0 / 10%);
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