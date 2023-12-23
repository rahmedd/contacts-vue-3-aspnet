import type { ComposeResultState } from "@/enums/ComposeResultState";
import type { Contact } from "@/requestTypes/Contact";
import type BaseReponse from "@/responseTypes/BaseResponse";
import type { Ref } from "vue";

// type StringGetter<T extends number> = (...args: T[]) => Promise<T>;


export interface ComposeResult<T1, T2, T3> {
	state: Ref<ComposeResultState>
	data: Ref<T1>
	update: (...args: T2[]) => Promise<T3>
}