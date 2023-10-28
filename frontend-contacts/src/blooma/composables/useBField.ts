import { computed, ref, provide, type Ref } from 'vue'
import { BFormStateKey } from '@/blooma/symbols'
import type { BForm } from '@/blooma/types/BForm'
import { BloomaTypes } from '@/blooma//enums/BloomaTypes'
import type { ValidationRuleCollection } from '@vuelidate/core'

// Duplicate of unexported `SupportedClasses` interface
interface Classes {
	valid?: string
	tested?: string
	invalid?: string
	warning?: string
	untested?: string
}

// Replace `undefined` with your class names of choice!
const DEFAULT_CLASSES: Classes = {
	valid: BloomaTypes.Success,
	tested: BloomaTypes.Info,
	invalid: BloomaTypes.Danger,
	warning: BloomaTypes.Warning,
	untested: BloomaTypes.Default,
}


export function useBField(v$: Ref<ValidationRuleCollection>, _classes?: Classes) {
	// method which returns respective classes depending on field's validity status;
	// here, we merge the user's input class names with the default class names
	// defined above
	// const classes = computed(() => {
	// 	return classnames(formState.value.suite, { ...DEFAULT_CLASSES, ..._classes })
	// })

	async function validate(): Promise<void> {

	}

	// the suite reset method
	function reset() {

	}

	// the suite reset method for a single field
	function resetField(field: string) {

	}

	// return { res, validate, reset, resetField }
	return { res }
}
