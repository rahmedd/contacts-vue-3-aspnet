<script setup lang="ts">
import { reactive, ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import { useAxios } from '@vueuse/integrations/useAxios'
import apiClient from '@/services/axios'
import { useAuthStore } from '@/stores/auth'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minLength } from '@vuelidate/validators'

import type BaseReponse from '@/responseTypes/BaseResponse'
import type LoginResponse from '@/responseTypes/LoginResponse'
import type SignupRequest from '@/requestTypes/SignupRequest'
import type UsernameRequest from '@/requestTypes/UsernameRequest'
import { BloomaTypes } from '@/blooma/enums/BloomaTypes'
import { BloomaValidationModes } from '@/blooma/enums/BloomaValidationModes'

import BInput from '@/blooma/BInput.vue'
import BButton from '@/blooma/BButton.vue'
import LoginForm from '@/components/LoginForm.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive<SignupRequest>({
	username: '',
	password: '',
	confirmPassword: '',
})

const isRequired = helpers.withMessage('Required', required)
const rules = {
	username: {
		isRequired,
		// isUnique: helpers.withAsync(checkUsernameCached),
		// isUnique: helpers.withMessage('Not Unique', helpers.withAsync(checkUsernameCached))
		// minLength: helpers.withMessage(
		// 	({
		// 		$pending,
		// 		$invalid,
		// 		$params,
		// 		$model
		// 	}) => `This field has a value of '${$model}' but must have a min length of ${JSON.stringify($params)} so it is ${$invalid ? 'invalid' : 'valid'}`,
		// 	helpers.withAsync(async () => ({ $message: 'please work' }))
		// )
		unique: {
			$async: true,
			// the trick
			$message: ({ $response }: { $response: { $valid: boolean, yourErrorMessage: boolean } }) => {
				return $response?.yourErrorMessage ?? 'default error message'
			},
			$validator: async (value: string) => {
				if (value === '')
					return true;

				const response = await checkUsernameCached(value)

				return {
					$valid: response.success,
					yourErrorMessage: response.message,
				}
			},
		}
	},
	password: { isRequired },
	confirmPassword: { isRequired },
}

const v$ = useVuelidate(rules, form)

const {
	data: loginRes,
	isFinished: loginFinished,
	execute: loginSendRequest,
	isLoading: isLoading,
} = useAxios<BaseReponse<LoginResponse>>('Auth/Login', { method: 'POST' }, apiClient, { immediate: false })

const {
	data: checkUsernameRes,
	execute: checkUsernameSendRequest,
	isLoading: checkUsernameLoading,
} = useAxios<BaseReponse<null>>('Auth/CheckUsername', { method: 'POST' }, apiClient, { immediate: false, resetOnExecute: false })

async function submitSignup(evt: Event) {
	evt.preventDefault()

	try {
		const vres = await v$.value.$validate()
		console.log(vres)

		if (!vres) {
			return
		}
	}
	catch (errors) {
		console.log('Error: submitSignup validation failed')
		return
	}

	try {
		const { data } = await loginSendRequest({
			data: {
				Username: form.username,
				Password: form.password
			}
		})

		const res = unref(data)!

		if (!res.success) {
			authStore.login(false, res.body)
			// setFieldError('password', 'Error creating account')
			return
		}
	}
	catch (ex) {
		console.log('Error: submitSignup request failed')
		console.log(ex)
	}
}

async function checkUsernameCached(username: string): Promise<BaseReponse<null>> {
	try {
		const res = await checkUsernameSendRequest({
			data: {
				Username: username,
			},
		})

		return res.data.value!
	}
	catch (ex) {
		return {
			body: null,
			message: '',
			success: false,
		}
	}
}

</script>

<template lang="pug">
LoginForm(:loading="isLoading" @keyup.enter="submitSignup")
	.login-container
		h1.login-title Sign up
		BInput#username.login-input(placeholder="Username" name="username" v-model="form.username" :showSuccess="true" :mode="BloomaValidationModes.Aggressive" :debounce="250" :val$="v$.username")
		BInput#password(placeholder="Password" name="password" v-model="form.password" :showSuccess="true" :debounce="250" :val$="v$.password")
		BInput#confirmPassword(placeholder="Confirm password" name="confirmPassword" v-model="form.confirmPassword" :showSuccess="true" :debounce="250" :val$="v$.confirmPassword")
		.field
			BButton.login-btn(:type="BloomaTypes.Primary" @click="submitSignup") Sign Up
		.login-button-container
			BButton.login-signup-link(:type="BloomaTypes.Ghost" @click='$router.push("/login")') Log in
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