import { type ComputedRef, type InjectionKey } from 'vue';
import type { BForm } from '@/blooma/types/BForm';

export const FormLoadingKey: InjectionKey<ComputedRef<boolean>> = Symbol('formLoading');
// export const BFormStateKey: InjectionKey<ComputedRef<BForm>> = Symbol('BFormState');
export const BFormStateKey = Symbol() as InjectionKey<BForm>