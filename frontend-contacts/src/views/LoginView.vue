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
					| Lorem ipsum leo risus, porta ac consectetur ac, vestibulum at eros. Donec id elit non mi porta gravida at eget metus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras mattis consectetur purus sit amet fermentum.
				FInput#username(type='text' placeholder='Username' name='username' v-model='formValue.username')
				p Don't have an account? Signup Now


</template>

<style lang="scss" scoped>
.card-footer {
	border-top: none;
}

.card {
	border-radius: 2.25rem;
}

.signup-now {
	display: flex;
	flex-direction: column;
}

</style>