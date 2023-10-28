import type { SuiteResult } from "vest"
import type { Ref } from "vue"

export interface BField<FieldName extends string, GroupName extends string> {
	name: Ref<string>
	group?: Ref<string>
	internalId: Ref<string>
	suiteResult: SuiteResult<FieldName, GroupName>
}

export enum BFieldValidity {
	ERROR,
	WARNING,
	LOADING,
	SUCCESS,
}