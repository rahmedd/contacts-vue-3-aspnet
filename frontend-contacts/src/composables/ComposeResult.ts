import type { ComposeResultState } from "@/enums/ComposeResultState";
import type { Contact } from "@/requestTypes/Contact";
import type BaseReponse from "@/responseTypes/BaseResponse";
import type { Ref } from "vue";

// type StringGetter<T extends number> = (...args: T[]) => Promise<T>;


export interface ComposeResult<T1, T2, T3, T4, T5> {
	state: Ref<ComposeResultState>
	data: Ref<T1>
	create: (...args: T2[]) => Promise<void>
	get: (...args: T3[]) => Promise<void>
	update: (...args: T4[]) => Promise<void>
	remove: (...args: T5[]) => Promise<void>
}