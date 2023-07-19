<script setup lang="ts">
import { ref, type PropType } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import {
	object as zobject,
	string as zstring
} from 'zod';
import { useAuthStore } from '@/stores/auth'
import { BloomaTypes } from '@/blooma/enums/BloomaTypes'
import { BloomaValidationModes } from '@/blooma/enums/BloomaValidationModes'
import { Contact } from '@/requestTypes/Contact'
import { ContactResponse } from '@/responseTypes/ContactResponse';
import BButton from '@/blooma/BButton.vue'
import BInput from '@/blooma/BInput.vue'
import Alphabet from '@/components/Alphabet.vue'

const props = defineProps({
	contact: {
		type: Object as PropType<ContactResponse>,
		required: true,
	},
})

const emits = defineEmits<{
	update: [id: number],
}>()

const formSchema = toTypedSchema(
	zobject({
		username: zstring()
			.min(4, { message: 'Username must be at least 4 characters long' })
			// .refine(checkUsernameCached, "Username not available")
		,
		password: zstring()
			.min(8, { message: 'Passsword must be at least 8 characters long' })
		,
		confirmPassword: zstring()
			.min(8, { message: 'Passsword must be at least 8 characters long' })
			// .refine(s => s === formValue.value.password, { message: 'Passwords do not match' })
		,
	})
)

const formValue = ref<Contact>({
	firstName: '',
	lastName: '',
	customFields: []
})

function selectContact(id: number) {
	emits('update', id)
}

</script>

<template lang="pug">
div
	BInput(placeholder='Firstname' name='firstname' v-model='formValue.firstName' :show-success="true" :mode="BloomaValidationModes.Aggressive" :debounce="250")
</template>

<style lang="scss" scoped>
@import '@/blooma/vars.scss';
@import "bulma/sass/utilities/initial-variables.sass"; // breakpoints

.button {
	width: 100%;
	font-size: 24px;
	font-weight: 600;
	border-radius: 0;
	text-align: left;
}
</style>