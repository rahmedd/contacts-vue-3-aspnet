import { type ComputedRef, type InjectionKey } from 'vue';

export const FormLoadingKey: InjectionKey<ComputedRef<boolean>> = Symbol('formLoading');