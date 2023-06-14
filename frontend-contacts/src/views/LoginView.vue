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
					h1.login-title Login
				BInput#username(class="login-input" placeholder='Username' name='username' v-model='formValue.username')
				BInput#password(placeholder='Password' name='password' v-model='formValue.password')
				.login-button-container
					BButton(:type="BloomaTypes.Primary" @click="submitLogin").login-btn Login
					BButton(:type="BloomaTypes.Default" :light="true" @click="").login-btn Signup
				p Don't have an account? Signup Now


</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';

.card {
	// border-radius: 2rem;
	box-shadow: none;
	background: #f9fcf8;
}

.card-content {
	padding: 3.5rem;
}
.card-footer {
	border-top: none;
}
.login-title {
	font-weight: 600;
}

.login-btn {
	width: 100%;
}

.modal-background {
	background: $bl-background;
}
.modal-content {
	// box-shadow: 5px 5px 20px gainsboro;
	// border-radius: 2rem;
}

.login-button-container {
	display: flex;
	flex-direction: column;

	.button {
		margin-bottom: 1em;
	}
}
</style>