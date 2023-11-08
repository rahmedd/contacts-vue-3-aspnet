import type { SuiteResult } from "vest"
import type { Ref } from "vue"
import type { BFieldValidity } from "@/blooma/types/BField"

export interface BForm<FieldName extends string, GroupName extends string> {
	// suite: Ref<SuiteResult<FieldName, GroupName>>
	// formState: BFormState<FieldName, GroupName>
	// suite: SuiteResult<FieldName, GroupName>
	state: BFormState<FieldName, GroupName>
}

// type Record<K extends keyof any, T> = {
// 	[P in K]: T;
// };

// export interface BFormState {
// 	dirty: boolean
// 	valid: BFieldValidity
// }

export type BFormState<FieldName extends string, GroupName extends string> = {
	[P in FieldName]?: {
		dirty: boolean
		valid: BFieldValidity
	}
}

